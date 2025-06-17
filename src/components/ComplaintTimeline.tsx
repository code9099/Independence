
import React from 'react';
import { CheckCircle, Clock, Mail, FileText, Eye, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  stage: string;
  timestamp: string;
  details?: string;
  metadata?: any;
}

interface ComplaintTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: string;
}

const TIMELINE_STAGES = [
  { key: "Submitted", label: "Submitted", icon: FileText, color: "blue" },
  { key: "Email Sent", label: "Email Sent", icon: Mail, color: "green" },
  { key: "Portal Registered", label: "Portal Registered", icon: CheckSquare, color: "purple" },
  { key: "Officer Viewed", label: "Officer Viewed", icon: Eye, color: "orange" },
  { key: "In Progress", label: "In Progress", icon: Clock, color: "yellow" },
  { key: "Resolved", label: "Resolved", icon: CheckCircle, color: "green" }
];

export default function ComplaintTimeline({ timeline, currentStatus }: ComplaintTimelineProps) {
  const getStageInfo = (stageName: string) => {
    return TIMELINE_STAGES.find(stage => stage.key === stageName) || 
           { key: stageName, label: stageName, icon: Clock, color: "gray" };
  };

  const isStageCompleted = (stageName: string) => {
    return timeline.some(event => event.stage === stageName);
  };

  const getStageColorClasses = (color: string, isCompleted: boolean) => {
    if (!isCompleted) {
      return {
        dot: "bg-gray-200 border-gray-300",
        line: "bg-gray-200",
        text: "text-gray-400"
      };
    }

    const colorMap = {
      blue: { dot: "bg-blue-500 border-blue-600", line: "bg-blue-200", text: "text-blue-600" },
      green: { dot: "bg-green-500 border-green-600", line: "bg-green-200", text: "text-green-600" },
      purple: { dot: "bg-purple-500 border-purple-600", line: "bg-purple-200", text: "text-purple-600" },
      orange: { dot: "bg-orange-500 border-orange-600", line: "bg-orange-200", text: "text-orange-600" },
      yellow: { dot: "bg-yellow-500 border-yellow-600", line: "bg-yellow-200", text: "text-yellow-600" },
      gray: { dot: "bg-gray-500 border-gray-600", line: "bg-gray-200", text: "text-gray-600" }
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Complaint Timeline</h3>
      
      <div className="space-y-6">
        {TIMELINE_STAGES.map((stage, index) => {
          const isCompleted = isStageCompleted(stage.key);
          const timelineEvent = timeline.find(event => event.stage === stage.key);
          const colors = getStageColorClasses(stage.color, isCompleted);
          const IconComponent = stage.icon;

          return (
            <div key={stage.key} className="flex items-start">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  colors.dot
                )}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                {/* Connecting line */}
                {index < TIMELINE_STAGES.length - 1 && (
                  <div className={cn("w-0.5 h-8 mt-2", colors.line)} />
                )}
              </div>

              {/* Content */}
              <div className="ml-4 flex-1 min-w-0">
                <div className={cn("text-sm font-medium", colors.text)}>
                  {stage.label}
                </div>
                {isCompleted && timelineEvent && (
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(timelineEvent.timestamp)}
                    </div>
                    {timelineEvent.details && (
                      <div className="text-sm text-gray-600 mt-1">
                        {timelineEvent.details}
                      </div>
                    )}
                    {timelineEvent.metadata?.referenceNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Ref: {timelineEvent.metadata.referenceNumber}
                      </div>
                    )}
                  </div>
                )}
                {!isCompleted && (
                  <div className="text-xs text-gray-400 mt-1">Pending</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status Badge */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            currentStatus === "Resolved" ? "bg-green-100 text-green-800" :
            currentStatus === "In Progress" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}>
            {currentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
