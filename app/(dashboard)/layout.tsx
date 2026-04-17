import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
