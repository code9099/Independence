
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";

const Index = lazy(() => import("@/pages/Index"));
const ReportProblemPage = lazy(() => import("@/pages/ReportProblemPage"));
const MyComplaintsPage = lazy(() => import("@/pages/MyComplaintsPage"));
const HeatmapPage = lazy(() => import("@/pages/HeatmapPage"));
const ThreadsPage = lazy(() => import("@/pages/ThreadsPage"));
const LeaderboardPage = lazy(() => import("@/pages/LeaderboardPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
import { AuthProvider } from "@/contexts/AuthContext";
import AppErrorBoundary from "@/components/AppErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <Router>
          <AppErrorBoundary>
            <Suspense fallback={<div className="app-container pt-24 text-sm text-muted-foreground">Loading…</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/report" element={<ReportProblemPage />} />
                  <Route path="/my-complaints" element={<MyComplaintsPage />} />
                  <Route path="/heatmap" element={<HeatmapPage />} />
                  <Route path="/threads" element={<ThreadsPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </AppErrorBoundary>
          <Toaster />
        </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
