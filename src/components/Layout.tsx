import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full min-w-0 bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppNavbar />
          <div className="flex-1 w-full min-w-0 px-4 md:px-8 py-6">
            <Outlet />
          </div>
          <AppFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
