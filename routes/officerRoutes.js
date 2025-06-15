
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Provide your Supabase connection details:
const SUPABASE_URL = "https://frinmxtouewkvfbxgsqi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyaW5teHRvdWV3a3ZmYnhnc3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzE2ODIsImV4cCI6MjA2NTUwNzY4Mn0.8tppFDGjue-MznlRHqBq77c_h1X3C0OaWbL90MY0Iek";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoint to fetch & sync officer/MLA details
router.get('/sync', async (req, res) => {
  try {
    // In a real app: scrape/sync real data from myneta.info, MCD, DJB, etc.
    // For demo: We'll use MOCK data for MLAs and officers

    // Example: mock MLA/Officer data
    const offArr = [
      {
        constituency: 'New Delhi',
        mla_name: 'Arvind Kejriwal',
        mla_party: 'AAP',
        mla_email: 'arvind@example.com',
        mla_phone: '+911112345678',
        mla_photo_url: 'https://myneta.info/photo/arvind-kejriwal.jpg',
        department_heads: [
          {
            department: 'MCD',
            name: "Rohit Kumar",
            designation: "DEPUTY COMMISSIONER",
            email: "rohit.mcd@example.com",
            mobile: "+919876543210"
          },
          {
            department: 'DJB',
            name: "Sunita Sharma",
            designation: "ZONAL ENGINEER",
            email: "sunita.djb@example.com",
            mobile: "+919999888777"
          },
        ]
      }
    ];

    // For each constituency, upsert MLA:
    for (const entry of offArr) {
      // 1. Upsert constituency (MLA details)
      let { data: constituency, error: constituencyError } = await supabase
        .from('constituencies')
        .upsert(
          {
            name: entry.constituency,
            mla_name: entry.mla_name,
            mla_party: entry.mla_party,
            mla_photo_url: entry.mla_photo_url,
            mla_email: entry.mla_email,
            mla_phone: entry.mla_phone,
          },
          { onConflict: ['name'] }
        ).select().single();

      if (constituencyError) throw constituencyError;

      // 2. Add/Upsert department_heads for this constituency
      for (const deptHead of (entry.department_heads || [])) {
        // Get department_id by name
        let { data: department, error: deptErr } = await supabase
          .from('departments')
          .select('id')
          .eq('name', deptHead.department)
          .maybeSingle();
        if (deptErr) continue;
        if (!department) continue;

        // Insert or upsert officer
        const { error: officerError } = await supabase
          .from('department_officers')
          .upsert(
            {
              name: deptHead.name,
              designation: deptHead.designation,
              email: deptHead.email,
              mobile: deptHead.mobile,
              department_id: department.id,
              is_active: true
            },
            { ignoreDuplicates: false }
          );
        // Ignore errors if duplicate for demo
      }
    }

    res.json({ ok: true, message: "Officer/MLA data synced!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Returns list of officers (optionally filtered by constituency)
router.get('/', async (req, res) => {
  // Optional: ?constituency=New Delhi
  // Will fetch MLA + active officers for the constituency
  try {
    let officers = [];
    if (req.query.constituency) {
      // Find constituency record
      const { data: con, error: ce } = await supabase
        .from('constituencies')
        .select('*')
        .eq('name', req.query.constituency)
        .maybeSingle();
      if (ce || !con) return res.status(404).json({ error: "Constituency not found" });

      // Fetch officers
      const { data: officersArr, error: oe } = await supabase
        .from('department_officers')
        .select(`
          id, name, designation, email, mobile, is_active,
          department:department_id(name)
        `)
        .eq('is_active', true);

      officers = officersArr || [];
      const mla = {
        name: con.mla_name,
        party: con.mla_party,
        email: con.mla_email,
        phone: con.mla_phone,
        photo_url: con.mla_photo_url,
        designation: 'MLA',
      };
      res.json({ mla, officers });
    } else {
      // Return all officers
      const { data: officersArr, error: oe } = await supabase
        .from('department_officers')
        .select('*')
        .eq('is_active', true);
      officers = officersArr || [];
      res.json({ officers });
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
