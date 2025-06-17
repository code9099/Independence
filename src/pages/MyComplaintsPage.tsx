
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Eye, Clock } from 'lucide-react';
import ComplaintTimeline from '@/components/ComplaintTimeline';

interface Complaint {
  _id: string;
  type: string;
  description: string;
  department: string;
  constituency?: string;
  submittedAt: string;
  status: string;
  timeline: Array<{
    stage: string;
    timestamp: string;
    details?: string;
    metadata?: any;
  }>;
  assignedOfficer?: {
    name: string;
    designation: string;
    email: string;
    zone: string;
  };
  referenceNumber?: string;
  emailSent?: boolean;
}

const DEFAULT_EMAIL = "user@janconnect.com";

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`/api/issues?reporter=${encodeURIComponent(DEFAULT_EMAIL)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const openTimeline = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLatestUpdate = (timeline: any[]) => {
    if (!timeline || timeline.length === 0) return "No updates";
    const latest = timeline[timeline.length - 1];
    return latest.stage;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">My Complaints</h1>
          <p className="text-gray-600 mt-2">Track your submitted complaints and their status</p>
        </div>
        <Button 
          onClick={() => navigate('/report')}
          className="bg-gradient-to-r from-blue-600 to-pink-400 hover:from-blue-700 hover:to-pink-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any complaints yet. Start making a difference in your community!</p>
            <Button 
              onClick={() => navigate('/report')}
              className="bg-gradient-to-r from-blue-600 to-pink-400 hover:from-blue-700 hover:to-pink-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Submit Your First Complaint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <Card key={complaint._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{complaint.type}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {complaint.description}
                    </CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Department & Officer Info */}
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{complaint.department}</span>
                  </div>
                  {complaint.assignedOfficer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Officer:</span>
                      <span className="font-medium text-xs">{complaint.assignedOfficer.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{complaint.constituency || 'N/A'}</span>
                  </div>
                </div>

                {/* Latest Update */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Latest Update:</div>
                  <div className="text-sm font-medium text-gray-900">
                    {getLatestUpdate(complaint.timeline)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(complaint.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Reference Number */}
                {complaint.referenceNumber && (
                  <div className="text-xs text-gray-500">
                    Ref: {complaint.referenceNumber}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openTimeline(complaint)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Timeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Timeline Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedComplaint?.type}
            </DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-6">
              {/* Complaint Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Complaint Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Description:</strong> {selectedComplaint.description}</p>
                  <p><strong>Department:</strong> {selectedComplaint.department}</p>
                  <p><strong>Location:</strong> {selectedComplaint.constituency || 'N/A'}</p>
                  {selectedComplaint.referenceNumber && (
                    <p><strong>Reference:</strong> {selectedComplaint.referenceNumber}</p>
                  )}
                </div>
              </div>

              {/* Assigned Officer */}
              {selectedComplaint.assignedOfficer && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Assigned Officer</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {selectedComplaint.assignedOfficer.name}</p>
                    <p><strong>Designation:</strong> {selectedComplaint.assignedOfficer.designation}</p>
                    <p><strong>Zone:</strong> {selectedComplaint.assignedOfficer.zone}</p>
                    <p><strong>Email:</strong> {selectedComplaint.assignedOfficer.email}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <ComplaintTimeline 
                timeline={selectedComplaint.timeline || []}
                currentStatus={selectedComplaint.status}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
