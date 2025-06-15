
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import useSession from "@/hooks/useSession";

interface Complaint {
  _id: string;
  type: string;
  description: string;
  department: string;
  constituency?: string;
  submittedAt: string;
  status: string;
  autoEmailSent?: boolean;
  referenceNumber?: string;
}

export default function MyComplaints() {
  const { user } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(
      `/api/issues?reporter=${encodeURIComponent(user.email!)}`
    )
      .then(r => r.json())
      .then(res => {
        if (Array.isArray(res)) setComplaints(res);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white/80 rounded-2xl border border-blue-200 shadow-md p-6 mt-8 animate-fade-in">
      <h3 className="font-bold text-xl mb-4 text-blue-900">My Complaints / Issues</h3>
      {loading ? (
        <div className="text-blue-600">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="text-gray-500">No complaints found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map(c => (
              <TableRow key={c._id}>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.constituency || <span className="text-gray-400">N/A</span>}</TableCell>
                <TableCell>
                  {c.status}
                  {c.status === "Resolved" && (
                    <span className="ml-1 text-green-500">●</span>
                  )}
                </TableCell>
                <TableCell>
                  {c.autoEmailSent
                    ? <span className="text-green-600">Sent</span>
                    : <span className="text-yellow-600">Pending</span>
                  }
                </TableCell>
                <TableCell>{new Date(c.submittedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="text-xs text-gray-400 pt-4">
        Track each step: <b>Auto email sent</b> → <b>In Progress</b> → <b>Completed</b>
      </div>
    </div>
  );
}
