
// Remove all session logic, show sidebar/navbar/profile at all times

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import HomeContent from "@/components/HomeContent";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background spin-in">
        <AppSidebar />
        <SidebarInset>
          <AppNavbar />
          <HomeContent />
          <AppFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
