import { useEffect } from 'react';
import Threads from "@/components/Threads";
import PageHeader from "@/components/PageHeader";

const ThreadsPage = () => {
  useEffect(() => {
    document.title = "Threads - JanConnect Professional Civic Solutions";
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6 animate-fade-in">
      <PageHeader title="Community Threads" subtitle="Discuss civic issues and solutions in your area" />
      <div className="w-full">
        <Threads />
      </div>
    </div>
  );
};

export default ThreadsPage;
