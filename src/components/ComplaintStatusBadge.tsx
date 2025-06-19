
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, Mail, FileText, Eye } from 'lucide-react';

interface ComplaintStatusBadgeProps {
  status: string;
  stage?: string;
  className?: string;
}

const getStatusInfo = (status: string, stage?: string) => {
  if (status === 'Resolved') {
    return {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
      text: 'Resolved'
    };
  }
  
  if (status === 'In Progress') {
    return {
      icon: Clock,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'In Progress'
    };
  }
  
  // Use stage info for pending complaints
  if (stage === 'Officer Viewed') {
    return {
      icon: Eye,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      text: 'Officer Viewed'
    };
  }
  
  if (stage === 'Email Sent') {
    return {
      icon: Mail,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      text: 'Email Sent'
    };
  }
  
  return {
    icon: AlertCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    text: 'Pending'
  };
};

export default function ComplaintStatusBadge({ status, stage, className }: ComplaintStatusBadgeProps) {
  const { icon: Icon, color, text } = getStatusInfo(status, stage);
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
      color,
      className
    )}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}
