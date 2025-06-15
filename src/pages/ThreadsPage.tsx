import Threads from "@/components/Threads";
import ReturnHomeButton from "@/components/ReturnHomeButton";

const ThreadsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-28 px-6 md:px-12 xl:px-32 bg-background relative animate-fade-in spin-in crazy-bounce">
      <ReturnHomeButton />
      <div className="w-full max-w-3xl animate-stagger flair-wave">
        <Threads />
      </div>
    </div>
  );
};

export default ThreadsPage;
