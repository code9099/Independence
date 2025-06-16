
/**
 * My Complaints Component
 * 
 * Displays a table of complaints/issues submitted by the current user.
 * Fetches data from the backend API and shows status tracking.
 */

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// TypeScript interface for complaint data structure
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

// Default email for mock logged-in user
// In a real app, this would come from authentication context
const DEFAULT_EMAIL = "user@janconnect.com";

export default function MyComplaints() {
  // Component state
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's complaints when component mounts
  useEffect(() => {
    setLoading(true);
    
    // API call to fetch complaints for the current user
    fetch(`/api/issues?reporter=${encodeURIComponent(DEFAULT_EMAIL)}`)
      .then(r => r.json())
      .then(res => {
        // Ensure we received an array of complaints
        if (Array.isArray(res)) setComplaints(res);
      })
      .catch(error => {
        console.error('Failed to fetch complaints:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white/80 rounded-2xl border border-blue-200 shadow-md p-6 mt-8 animate-fade-in">
      <h3 className="font-bold text-xl mb-4 text-blue-900">
        My Complaints / Issues
      </h3>
      
      {/* Loading state */}
      {loading ? (
        <div className="text-blue-600">Loading...</div>
      ) : complaints.length === 0 ? (
        /* Empty state */
        <div className="text-gray-500">No complaints found.</div>
      ) : (
        /* Complaints table */
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
            {complaints.map(complaint => (
              <TableRow key={complaint._id}>
                <TableCell>{complaint.type}</TableCell>
                <TableCell>
                  {complaint.constituency || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {complaint.status}
                  {/* Visual indicator for resolved complaints */}
                  {complaint.status === "Resolved" && (
                    <span className="ml-1 text-green-500">●</span>
                  )}
                </TableCell>
                <TableCell>
                  {/* Email notification status */}
                  {complaint.autoEmailSent
                    ? <span className="text-green-600">Sent</span>
                    : <span className="text-yellow-600">Pending</span>
                  }
                </TableCell>
                <TableCell>
                  {new Date(complaint.submittedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Status explanation */}
      <div className="text-xs text-gray-400 pt-4">
        Track each step: <b>Auto email sent</b> → <b>In Progress</b> → <b>Completed</b>
      </div>
    </div>
  );
}
