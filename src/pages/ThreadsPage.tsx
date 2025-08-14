import { useEffect } from 'react';
import Threads from "@/components/Threads";
import PageHeader from "@/components/PageHeader";

const ThreadsPage = () => {
  useEffect(() => {
    document.title = "Threads - JanConnect Professional Civic Solutions";
  }, []);

  return (
    <div className="app-container py-6 page-stack animate-fade-in">
      <PageHeader title="Community Threads" subtitle="Discuss civic issues and solutions in your area" />
      <div className="w-full">
        <Threads />
      </div>
    </div>
  );
};

export default ThreadsPage;
