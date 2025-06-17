
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, Plus } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user's display name and other info
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userPhone = user?.user_metadata?.phone || '';
  const userWard = user?.user_metadata?.ward || '';
  const userConstituency = user?.user_metadata?.constituency || '';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Welcome Message */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-pink-400 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
        <p className="text-lg opacity-90">Ready to make a difference in your community?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Profile
            </CardTitle>
            <CardDescription>Your registered information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg">{displayName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg">{userEmail}</p>
            </div>
            {userPhone && (
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-lg">{userPhone}</p>
              </div>
            )}
            {userWard && (
              <div>
                <label className="text-sm font-medium text-gray-600">Ward</label>
                <p className="text-lg">{userWard}</p>
              </div>
            )}
            {userConstituency && (
              <div>
                <label className="text-sm font-medium text-gray-600">Constituency</label>
                <p className="text-lg">{userConstituency}</p>
              </div>
            )}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-pink-400 hover:from-blue-700 hover:to-pink-500 text-white"
              onClick={() => navigate('/report')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Submit Complaint
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/my-complaints')}
            >
              <FileText className="mr-2 h-4 w-4" />
              View My Complaints
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/threads')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Community Discussions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity or Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>Your contribution to the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Complaints Submitted</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Issues Resolved</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Community Points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
