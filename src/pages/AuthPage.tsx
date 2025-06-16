
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    ward: '',
    constituency: ''
  });

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      navigate('/');
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.error || "Please check your credentials and try again.",
      });
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (registerData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(registerData.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid Indian mobile number.",
      });
      setLoading(false);
      return;
    }

    const result = await register(registerData);

    if (result.success) {
      toast({
        title: "Account created!",
        description: "Welcome to JanConnect. You can now submit complaints.",
      });
      navigate('/');
    } else {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: result.error || "Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">JanConnect</CardTitle>
          <CardDescription>Delhi's Civic Reporting Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-ward">Ward</Label>
                  <Input
                    id="register-ward"
                    type="text"
                    placeholder="e.g., Ward 125"
                    value={registerData.ward}
                    onChange={(e) => setRegisterData({ ...registerData, ward: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-constituency">Constituency</Label>
                  <Input
                    id="register-constituency"
                    type="text"
                    placeholder="e.g., New Delhi"
                    value={registerData.constituency}
                    onChange={(e) => setRegisterData({ ...registerData, constituency: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
