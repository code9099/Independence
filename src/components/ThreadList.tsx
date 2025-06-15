
import React from "react";
import ThreadCard from "./ThreadCard";

function ThreadList({ threads }: { threads: any[] }) {
  return (
    <div className="mt-3">
      {threads.map(thread => (
        <ThreadCard thread={thread} key={thread.id} />
      ))}
    </div>
  );
}

export default ThreadList;
