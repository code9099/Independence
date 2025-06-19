
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, User, Mail, Eye, ExternalLink } from 'lucide-react';
import ComplaintStatusBadge from './ComplaintStatusBadge';

interface ComplaintCardProps {
  complaint: {
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
    }>;
    assignedOfficer?: {
      name: string;
      designation: string;
      email: string;
      zone: string;
    };
    referenceNumber?: string;
    emailSent?: boolean;
  };
  onViewTimeline: () => void;
}

export default function ComplaintCard({ complaint, onViewTimeline }: ComplaintCardProps) {
  const getLatestStage = () => {
    return complaint.timeline?.length > 0 
      ? complaint.timeline[complaint.timeline.length - 1].stage 
      : 'Submitted';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {complaint.type}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm">
              {complaint.description}
            </CardDescription>
          </div>
          <ComplaintStatusBadge 
            status={complaint.status} 
            stage={getLatestStage()}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Department & Reference */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {complaint.department}
            </Badge>
          </div>
          {complaint.referenceNumber && (
            <div className="text-xs text-gray-500">
              Ref: {complaint.referenceNumber}
            </div>
          )}
        </div>

        {/* Location & Date */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{complaint.constituency || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(complaint.submittedAt)}</span>
          </div>
        </div>

        {/* Officer Info */}
        {complaint.assignedOfficer && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                {complaint.assignedOfficer.name}
              </span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>{complaint.assignedOfficer.designation}</div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {complaint.assignedOfficer.email}
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicators */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {complaint.emailSent && (
              <div className="flex items-center gap-1 text-green-600">
                <Mail className="w-3 h-3" />
                <span>Email Sent</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{complaint.timeline?.length || 0} updates</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewTimeline}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View Timeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
