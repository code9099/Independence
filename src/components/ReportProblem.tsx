import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, ImagePlus, Compass, MapPin, Loader2, MailCheck, MailX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConstituencySelector from "@/components/ConstituencySelector";
import { useToast } from "@/hooks/use-toast";

// Basic constants
const DEFAULT_EMAIL = "user@janconnect.com";
const ISSUE_TYPES = [
  { label: "Garbage Overflow", value: "garbage", emoji: "🗑️" },
  { label: "Water Leakage", value: "water", emoji: "💧" },
  { label: "Streetlight Broken", value: "light", emoji: "💡" },
  { label: "Pothole", value: "pothole", emoji: "🕳️" },
  { label: "Other", value: "other", emoji: "❓" },
];
const DEPARTMENTS = [
  { name: "MCD", emoji: "🏛️", color: "bg-blue-100 text-blue-800" },
  { name: "PWD", emoji: "🚧", color: "bg-yellow-100 text-yellow-800" },
  { name: "DJB", emoji: "💧", color: "bg-cyan-100 text-cyan-800" },
];
function mapDept(issue: string) {
  if (issue === "garbage") return DEPARTMENTS[0];
  if (issue === "water") return DEPARTMENTS[2];
  if (issue === "pothole" || issue === "light") return DEPARTMENTS[1];
  return DEPARTMENTS[0];
}

type EmailPopupInfo = null | {
  success: boolean;
  officerName?: string;
  officerEmail?: string;
  sentAt?: string;
  status?: string;
  error?: string;
};

const ReportProblem: React.FC = () => {
  const { toast } = useToast();

  // Stepper state
  const [step, setStep] = useState<number>(0); // 0 details, 1 media+location, 2 review
  const progress = Math.round(((step + 1) / 3) * 100);

  // Form state
  const [issueType, setIssueType] = useState<string>("garbage");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [constituency, setConstituency] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [emailPopup, setEmailPopup] = useState<EmailPopupInfo>(null);

  const dept = useMemo(() => mapDept(issueType), [issueType]);

  // Lightweight category hint from description
  useEffect(() => {
    if (!description) return;
    const d = description.toLowerCase();
    if (d.includes("garbage") || d.includes("trash") || d.includes("waste")) setIssueType("garbage");
    else if (d.includes("water") || d.includes("leak")) setIssueType("water");
    else if (d.includes("light")) setIssueType("light");
    else if (d.includes("pothole")) setIssueType("pothole");
  }, [description]);

  // Handlers
  const onNext = () => setStep((s) => Math.min(2, s + 1));
  const onBack = () => setStep((s) => Math.max(0, s - 1));
  const onDropFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []);
    if (f.length) setFiles((prev) => [...prev, ...f].slice(0, 6));
  };
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Location not available", description: "Your browser blocked geolocation.", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast({ title: "Location failed", description: "Could not fetch your location.", variant: "destructive" }),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  async function handleSubmit() {
    setSubmitting(true);
    const payload: any = {
      type: ISSUE_TYPES.find((x) => x.value === issueType)?.label || "Other",
      title: title || ISSUE_TYPES.find((x) => x.value === issueType)?.label,
      description,
      department: dept.name,
      constituency,
      reporter: DEFAULT_EMAIL,
      submittedAt: new Date(),
      location: coords ? { type: "Point", coordinates: [coords.lng, coords.lat] } : undefined,
      attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    };
    try {
      const res = await fetch("/api/issues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const info: EmailPopupInfo = {
        success: json.emailStatus?.success || false,
        officerName: json.departmentMapping?.officer?.name || `${dept.name} Officer`,
        officerEmail: json.departmentMapping?.officer?.email || "unknown",
        sentAt: json.issue?.emailLog?.sentAt ? new Date(json.issue.emailLog.sentAt).toLocaleString() : undefined,
        status: json.issue?.emailLog?.status || "unknown",
        error: json.emailStatus?.error || json.issue?.emailLog?.error,
      };
      setEmailPopup(info);
      setDialogOpen(true);
      toast({ title: "Submitted", description: "Your complaint was submitted successfully." });
      // Reset
      setStep(0); setTitle(""); setDescription(""); setFiles([]); setCoords(null); setConstituency(null);
    } catch (err: any) {
      setEmailPopup({ success: false, error: err?.message || "Unknown error" });
      setDialogOpen(true);
      toast({ title: "Submission failed", description: err?.message || "Unknown error", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  // Step UIs
  const StepDetails = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <label className="text-sm font-medium">Select issue type</label>
        <div className="flex flex-wrap gap-2">
          {ISSUE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setIssueType(t.value)}
              className={cn("px-3 py-2 rounded-lg border text-sm flex items-center gap-2 transition", issueType === t.value ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary border-border hover:bg-secondary/70")}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium">Short title</label>
          <Input placeholder="e.g., Garbage pile near main crossing" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea rows={5} placeholder="Describe what happened, where, and any helpful details" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Auto‑routed department:</span>
          <span className={cn("text-sm font-semibold px-2 py-1 rounded-md border", dept.color)}>{dept.emoji} {dept.name}</span>
        </div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="text-sm font-medium mb-2">Tips for faster resolution</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Add a clear photo or short video</li>
            <li>Pin the exact location</li>
            <li>Provide a concise title</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const StepMediaLocation = (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <label className="text-sm font-medium">Upload evidence (images/videos)</label>
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-2"><ImagePlus className="w-4 h-4" /> Drag and drop or choose files</div>
          <Input type="file" multiple accept="image/*,video/*" onChange={onDropFiles} capture="environment" />
          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {files.map((f, i) => (
                <div key={i} className="text-xs truncate bg-muted rounded p-2 border">{f.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium">Constituency</label>
        <ConstituencySelector value={constituency} onChange={setConstituency} />
        <div className="flex items-center gap-2 mt-2">
          <Button type="button" variant="outline" onClick={useMyLocation} className="flex items-center gap-2"><Compass className="w-4 h-4" /> Use my location</Button>
          {coords && <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</div>}
        </div>
      </div>
    </div>
  );

  const StepReview = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">You’re about to submit</div>
        <div className="bg-secondary rounded-xl p-4 border border-border">
          <div className="font-medium">{title || ISSUE_TYPES.find((t) => t.value === issueType)?.label}</div>
          <div className="text-sm text-muted-foreground mt-1">{description || "No description"}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-md bg-secondary border border-border">{dept.emoji} {dept.name}</span>
            {constituency && <span className="px-2 py-1 rounded-md bg-secondary border border-border">Constituency #{constituency}</span>}
            {coords && <span className="px-2 py-1 rounded-md bg-secondary border border-border">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>}
            <span className="px-2 py-1 rounded-md bg-secondary border border-border">{files.length} attachment(s)</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">By submitting, you agree that the information is accurate and respectful. Your email will be used to notify you about updates.</div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Simple hero */}
      <section className="full-bleed hero-gradient py-10 shadow-sm">
        <div className="app-container">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary-foreground">Report an Issue</h1>
          </div>
          <p className="mt-1 text-primary-foreground/90 max-w-2xl">Help your city improve by submitting issues with clear details, media, and an exact location.</p>
        </div>
      </section>

      {/* Main content card */}
      <div className="app-container mt-6">
        <div className="card-premium p-4 md:p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-sm mb-4">
            {["Details", "Evidence & Location", "Review & Submit"].map((label, i) => (
              <div key={label} className={cn("px-3 py-1 rounded-full border", i <= step ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-secondary-foreground border-border")}>{label}</div>
            ))}
            <div className="ml-auto w-40"><Progress value={progress} className="h-2" /></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="md:col-span-2">
              {step === 0 ? StepDetails : step === 1 ? StepMediaLocation : StepReview}
              <div className="mt-6 flex items-center gap-2">
                {step > 0 && <Button variant="outline" onClick={onBack}>Back</Button>}
                {step < 2 && <Button onClick={onNext} className="ml-auto">Next</Button>}
                {step === 2 && (
                  <Button onClick={handleSubmit} className="ml-auto" disabled={submitting}>
                    {submitting ? (<span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</span>) : "Submit"}
                  </Button>
                )}
              </div>
            </div>
            <aside className="hidden lg:block sticky top-28 self-start space-y-3">
              <div className="glass-panel p-4 rounded-xl">
                <div className="text-sm text-muted-foreground mb-2">Live preview</div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="text-lg font-semibold mb-1">{title || ISSUE_TYPES.find((t) => t.value === issueType)?.label}</div>
                  <div className="text-sm text-muted-foreground line-clamp-5">{description || "Description will appear here..."}</div>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="px-2 py-1 rounded-md bg-secondary border border-border">{dept.emoji} {dept.name}</span>
                    {constituency && <span className="px-2 py-1 rounded-md bg-secondary border border-border">Constituency #{constituency}</span>}
                    {coords && <span className="px-2 py-1 rounded-md bg-secondary border border-border">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>}
                    <span className="px-2 py-1 rounded-md bg-secondary border border-border">{files.length} attachment(s)</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Result dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {emailPopup?.success ? (
                <span className="flex items-center gap-2 text-green-700"><MailCheck className="w-5 h-5" /> Email Sent Successfully</span>
              ) : (
                <span className="flex items-center gap-2 text-red-700"><MailX className="w-5 h-5" /> Email Status</span>
              )}
            </DialogTitle>
            <DialogDescription>
              {emailPopup?.success ? (
                <div>
                  <div className="text-sm mb-2">Officer notified: <b>{emailPopup.officerName}</b> <span className="text-muted-foreground">({emailPopup.officerEmail})</span></div>
                  <div className="text-xs text-muted-foreground mb-2">Sent at: {emailPopup.sentAt || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">Status: {emailPopup.status}</div>
                </div>
              ) : (
                <div className="text-sm">Your complaint was saved, but the officer email failed. We’ll retry automatically.</div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportProblem;

