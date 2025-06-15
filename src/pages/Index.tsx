import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import HomeContent from "@/components/HomeContent";
import useSession from "@/hooks/useSession";

// For the sidebar handler
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  // Logout handler for AppSidebar to redirect after logout
  const handleLogout = () => {
    navigate("/auth");
  };

  // If user is logged in, show sidebar layout
  if (!loading && user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background spin-in">
          <AppSidebar onLogout={handleLogout} />
          <SidebarInset>
            <AppNavbar />
            <HomeContent />
            <AppFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Default layout if not logged in:
  return (
    <div className="min-h-screen flex flex-col bg-background spin-in">
      <AppNavbar />
      <HomeContent />
      <AppFooter />
    </div>
  );
};

export default Index;
