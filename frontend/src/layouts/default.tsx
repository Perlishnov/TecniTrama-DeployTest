import Sidebar from "@/components/sidebar";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow ml-80">
        <main className="container mx-auto max-w-7xl pr-6 flex-grow pt-5 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
