// /api/sendDepartmentEmail.ts - Vercel/Node serverless handler
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER as string, pass: process.env.SMTP_PASS as string },
});

function makeTrackingId(city = 'DL') {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `JC-${city}-${year}-${rand}`;
}

function sanitizePlain(text = '') {
  return text.replace(/\s+/g, ' ').trim().slice(0, 1000);
}

function buildSubject(trackingId: string, title: string) {
  return `[JanConnect] ${trackingId} — ${sanitizePlain(title)}`;
}

function buildHtml(opts: any) {
  const mapLink = (opts.lat && opts.lng) ? `https://maps.google.com/?q=${opts.lat},${opts.lng}` : '#';
  const gallery = (opts.media || []).map((u: string) => `<li><a href="${u}">${u}</a></li>`).join('');
  return `
    <div style="font-family:Inter,system-ui,Arial;padding:16px;color:#111">
      <h2 style="margin:0 0 8px">New Civic Complaint</h2>
      <p style="margin:0 0 16px">Tracking ID: <strong>${opts.trackingId}</strong></p>
      <p><strong>Title:</strong> ${sanitizePlain(opts.title)}</p>
      <p><strong>Description:</strong> ${sanitizePlain(opts.description)}</p>
      <p><strong>Category:</strong> ${opts.category || '-'} / ${opts.subCategory || '-'}</p>
      <p><strong>Location:</strong> Ward ${opts.ward || '-'} ${opts.zone ? '· Zone ' + opts.zone : ''} · <a href="${mapLink}">Open Map</a></p>
      ${gallery ? `<p><strong>Evidence:</strong></p><ul>${gallery}</ul>` : ''}
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
      <p>This complaint was submitted via <strong>JanConnect</strong>. The reporter’s identity is private.</p>
      <p>To respond or request more info, open the secure case page:<br/>
      <a href="${process.env.APP_BASE_URL}/case/${encodeURIComponent(opts.trackingId)}">${process.env.APP_BASE_URL}/case/${encodeURIComponent(opts.trackingId)}</a></p>
      <p style="color:#666;font-size:12px;">If this appears misrouted, please forward to the correct department and mark “Reassigned” in the case page.</p>
    </div>
  `;
}

async function findCandidateDepartments(input: { category?: string; ward?: string; zone?: string; text?: string }) {
  const text = (input.text || '').toLowerCase();
  const { data, error } = await supabase.from('departments').select('*').eq('active', true);
  if (error) throw error;
  const scored = (data || []).map((d: any) => {
    let score = 0;
    if (input.category && d.category?.toLowerCase().includes(input.category.toLowerCase())) score += 5;
    if (input.ward && d.ward && d.ward === input.ward) score += 3;
    if (input.zone && d.zone && d.zone === input.zone) score += 2;
    if (d.keywords) {
      const kws = String(d.keywords).toLowerCase().split(',').map((k: string) => k.trim());
      if (kws.some((k: string) => k && text.includes(k))) score += 4;
    }
    score += Math.max(0, 4 - (Number(d.priority || 3)));
    return { d, score };
  }).sort((a: any, b: any) => b.score - a.score);
  const unique: any[] = [];
  for (const s of scored) {
    if (!unique.find(u => u.d.dept_id === s.d.dept_id)) unique.push(s);
    if (unique.length >= 2) break;
  }
  return unique.map(u => u.d);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { title, description, category, subCategory, lat, lng, ward, zone, media_urls, anonymous, reporter_contact } = req.body;
    const tracking_id = makeTrackingId('DL');
    const reporter_contact_hash = anonymous && reporter_contact ? crypto.createHash('sha256').update(String(reporter_contact)).digest('hex') : null;

    const { data: complaint, error: cErr } = await supabase.from('complaints').insert([{
      tracking_id, title, description, category, sub_category: subCategory,
      lat, lng, ward, zone, media_urls,
      reporter_contact_hash,
      status: 'under_review'
    }]).select().single();
    if (cErr) throw cErr;

    const candidates = await findCandidateDepartments({ category, ward, zone, text: `${title} ${description}` });
    if (candidates.length === 0) return res.status(200).json({ tracking_id, message: 'Saved. No department match; queued for manual triage.' });

    const html = buildHtml({ trackingId: tracking_id, title, description, category, subCategory, ward, zone, lat, lng, media: media_urls });
    const subject = buildSubject(tracking_id, title);

    for (const dept of candidates) {
      const to = dept.primary_email;
      const cc = (dept.cc_emails || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM!,
          to,
          cc,
          replyTo: process.env.EMAIL_REPLY_TO!,
          subject,
          html,
          text: html.replace(/<[^>]+>/g, ' ')
        });
        await supabase.from('email_events').insert([{
          complaint_id: complaint.id,
          department_id: dept.id,
          to_email: to,
          cc_emails: cc.join(','),
          subject,
          status: 'sent',
          provider_message_id: info.messageId,
          payload_snapshot: { dept_id: dept.dept_id, tracking_id }
        }]);
        await supabase.from('complaints').update({ assigned_department_id: dept.id, status: 'assigned' }).eq('id', complaint.id);
      } catch (err: any) {
        await supabase.from('email_events').insert([{
          complaint_id: complaint.id,
          department_id: dept.id,
          to_email: to,
          subject,
          status: 'failed',
          error: String(err)
        }]);
      }
    }

    return res.status(200).json({ tracking_id, message: 'Complaint submitted and routed via email.' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}


