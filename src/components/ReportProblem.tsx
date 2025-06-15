
import React, { useState } from "react";
import { Check, ArrowDown, ThumbsUp, MailCheck, MailX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";

const DEPARTMENTS = [
  { name: "MCD", emoji: "🏛️", color: "bg-blue-100 text-blue-800" },
  { name: "PWD", emoji: "🚧", color: "bg-yellow-100 text-yellow-800" },
  { name: "DJB", emoji: "💧", color: "bg-cyan-100 text-cyan-800" },
];

const issues = [
  { label: "Garbage Overflow", value: "garbage", emoji: "🗑️" },
  { label: "Water Leakage", value: "water", emoji: "💧" },
  { label: "Streetlight Broken", value: "light", emoji: "💡" },
  { label: "Pothole", value: "pothole", emoji: "🕳️" },
  { label: "Other", value: "other", emoji: "❓" },
];

function getDeptForIssue(issue: string) {
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
  const { user } = useSession();
  const [selected, setSelected] = useState<string | null>("garbage");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [anim, setAnim] = useState(false);

  // For email status dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailPopup, setEmailPopup] = useState<EmailPopupInfo>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    const d = getDeptForIssue(value);
    setDept(d);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setAnim(true);

    // Build complaint payload
    const complaintData: any = {
      type: issues.find(x => x.value === selected)?.label || "Other",
      description: desc,
      department: dept.name,
      constituency: "", // extend form to collect this if needed
      reporter: user?.email || "anonymous",
      submittedAt: new Date(),
    };

    let emailInfo: EmailPopupInfo = null;
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData),
      });
      const json = await res.json();
      if (json.emailStatus && json.emailLog) {
        emailInfo = {
          success: json.emailStatus.success,
          officerName: dept.name + " Officer",
          officerEmail: json.emailLog.to || "unknown",
          sentAt: json.emailLog.sentAt
            ? new Date(json.emailLog.sentAt).toLocaleString()
            : undefined,
          status: json.emailLog.status,
          error: json.emailLog.error,
        };
      } else if (json.emailStatus) {
        emailInfo = {
          success: json.emailStatus.success,
          officerName: dept.name + " Officer",
          officerEmail: "unknown",
          sentAt: undefined,
          status: json.emailStatus.success ? "sent" : "failed",
          error: json.emailStatus.error,
        };
      } else {
        emailInfo = {
          success: false,
          error: "Unknown error sending email",
        };
      }
    } catch (err: any) {
      emailInfo = {
        success: false,
        error: err?.message || "Failed to send complaint",
      };
    }
    setTimeout(() => setAnim(false), 1200);
    setTimeout(() => setSubmitted(false), 2500);
    setDesc("");
    setSelected("garbage");
    setDept(DEPARTMENTS[0]);
    setEmailPopup(emailInfo);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white dark:bg-muted/90 shadow-xl rounded-3xl px-8 py-8 w-full border border-blue-100 flex flex-col gap-4 animate-fade-in">
      <h2 className="font-semibold text-xl mb-2 text-blue-800 flex items-center gap-2">
        <ArrowDown className="w-6 h-6 text-blue-500" /> Report a Problem
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">Issue Type</label>
        <div className="flex flex-wrap gap-2">
          {issues.map(iss => (
            <button
              key={iss.value}
              className={cn(
                "px-3 py-2 rounded-lg border flex items-center gap-2 transition-colors shadow-sm text-lg",
                selected === iss.value
                  ? "bg-blue-100 border-blue-400 font-bold"
                  : "bg-gray-50 hover:bg-blue-50 border-gray-200"
              )}
              type="button"
              onClick={() => handleSelect(iss.value)}
            >
              <span>{iss.emoji}</span>
              {iss.label}
            </button>
          ))}
        </div>
        <label className="text-sm font-semibold pt-2 text-gray-700">Description</label>
        <textarea
          className="rounded-lg border border-gray-200 py-2 px-3 resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Describe the problem and its location..."
          rows={3}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          required
        />
        <button
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition-all shadow-lg text-lg flex items-center gap-2 justify-center animate-fade-in"
          type="submit"
          disabled={submitted}
        >
          <ThumbsUp className="w-5 h-5" /> {submitted ? "Submitted!" : "Submit"}
        </button>
      </form>
      <div className="mt-1">
        {/* AI Powered Dept Detection Animation */}
        <div className={cn(
          "flex gap-2 items-center transition-all duration-300",
          anim ? "opacity-100" : "opacity-40"
        )}>
          <span className="text-sm font-medium text-gray-600 animate-pulse">
            Department Detected:
          </span>
          <span className={cn(
            "text-sm font-bold px-3 py-1 rounded-xl transition-all duration-500",
            dept.color
          )}>
            {dept.emoji} {dept.name}
          </span>
          {anim && <Check className="w-5 h-5 text-green-500 animate-bounce ml-2" />}
        </div>
      </div>
      <div className="text-xs text-gray-400 pt-4 pb-2">
        <span className="font-medium">AI-powered auto-routing</span> <span aria-hidden>🤖</span>
      </div>
      {/* Email status Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {emailPopup?.success
                ? (<span className="flex items-center gap-2 text-green-700"><MailCheck className="w-5 h-5" /> Email Sent Successfully</span>)
                : (<span className="flex items-center gap-2 text-red-700"><MailX className="w-5 h-5" /> Email Failed</span>)
              }
            </DialogTitle>
            <DialogDescription>
              {emailPopup?.success ? (
                <div>
                  <div className="text-md mb-2 text-blue-900">Complaint has been emailed to:</div>
                  <div className="font-semibold flex items-center gap-5 mb-2">
                    <span>{emailPopup.officerName}</span>
                    <span className="text-xs text-gray-600">{emailPopup.officerEmail}</span>
                  </div>
                  <div className="text-xs text-gray-700 mb-2">
                    <b>Sent At:</b> {emailPopup.sentAt || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500">
                    <b>Status:</b> {emailPopup.status}
                  </div>
                  <div className="flex mt-4">
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        setDialogOpen(false);
                        window.location.href = "/profile"; // or "/my-complaints"
                      }}
                    >
                      Track Email
                    </Button>
                  </div>
                  <div className="text-green-700 font-semibold mt-2">
                    We’ve notified the responsible officer. You’ll be updated when action is taken.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-md text-red-800 mb-2 font-semibold">
                    Email was not sent. Please try again or contact support.
                  </div>
                  {emailPopup?.error && (
                    <div className="text-xs text-red-600 mb-2">
                      Error: {emailPopup.error}
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} className="w-full mt-2">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ReportProblem;
