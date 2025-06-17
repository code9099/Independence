
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';

export default function MyComplaintsPage() {
  const navigate = useNavigate();

  // Mock complaints data - in real app this would come from API
  const complaints = [
    {
      id: 1,
      title: 'Broken Street Light',
      description: 'Street light on Park Road is not working',
      status: 'In Progress',
      date: '2024-01-15',
      department: 'PWD'
    },
    {
      id: 2,
      title: 'Garbage Collection Issue',
      description: 'Garbage not collected for 3 days in Sector 15',
      status: 'Resolved',
      date: '2024-01-10',
      department: 'MCD'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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

      {complaints.length === 0 ? (
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
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                    <CardDescription className="mt-1">{complaint.description}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Department: {complaint.department}</span>
                  <span>Submitted: {complaint.date}</span>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
