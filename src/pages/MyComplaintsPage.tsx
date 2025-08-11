
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, FileText } from 'lucide-react';
import ComplaintTimeline from '@/components/ComplaintTimeline';
import ComplaintCard from '@/components/ComplaintCard';
import PageHeader from '@/components/PageHeader';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    document.title = "My Complaints - JanConnect Professional Civic Solutions";
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

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.constituency?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: complaints.length,
      'Pending': complaints.filter(c => c.status === 'Pending').length,
      'In Progress': complaints.filter(c => c.status === 'In Progress').length,
      'Resolved': complaints.filter(c => c.status === 'Resolved').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-8">
      {/* Header */}
        <PageHeader
          title="My Complaints"
          subtitle="Track your submitted complaints and their progress"
          action={(
            <Button onClick={() => navigate('/report')}>
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          )}
        />

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`bg-card rounded-xl border border-border p-4 cursor-pointer transition hover:shadow-sm ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {status === 'all' ? 'Total' : status}
              </div>
            </div>
          ))}
        </section>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-8 w-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {complaints.length === 0 ? 'No complaints yet' : 'No matching complaints'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {complaints.length === 0 
              ? "You haven't submitted any complaints yet. Start making a difference!"
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {complaints.length === 0 && (
            <Button onClick={() => navigate('/report')}>
              <Plus className="mr-2 h-4 w-4" />
              Submit Your First Complaint
            </Button>
          )}
        </div>
      ) : (
        /* Complaints Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onViewTimeline={() => openTimeline(complaint)}
            />
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
              <div className="bg-muted rounded-lg p-4">
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
                <div className="bg-secondary rounded-lg p-4">
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
