
import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ThreadReplies from "./ThreadReplies";

const emojiPicker = ["👍", "😂", "🔥", "😢", "👏", "🤔", "💯"];

function ThreadCard({ thread }: { thread: any }) {
  const [upvotes, setUpvotes] = useState(thread.up);
  const [downvotes, setDownvotes] = useState(thread.down);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="bg-white dark:bg-muted/80 rounded-xl px-0 pb-5 mb-5 shadow border border-blue-50 animate-fade-in relative overflow-hidden">
      {/* Thread Image */}
      {thread.image && (
        <img src={thread.image} alt="thread subject" className="w-full h-52 object-cover object-center rounded-t-xl" />
      )}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-3">
          <img src={thread.avatar} alt={thread.user} className="w-8 h-8 rounded-full border" />
          <span className="font-semibold">{thread.user}</span>
          <span className="text-lg">{thread.emoji}</span>
          <span className="ml-auto text-xs text-gray-400">{thread.created}</span>
        </div>
        <div className="pt-2 font-medium text-blue-900">{thread.title}</div>
        <div className="flex items-center gap-2 pt-2">
          <button
            className={cn("rounded-full p-1 hover:bg-blue-100", upvotes > thread.up && "bg-blue-200")}
            onClick={() => setUpvotes(v => v + 1)}
            aria-label="Upvote"
            type="button"
          >
            <ArrowUp />
          </button>
          <span className="font-semibold">{upvotes}</span>
          <button
            className={cn("rounded-full p-1 hover:bg-orange-100", downvotes > thread.down && "bg-orange-200")}
            onClick={() => setDownvotes(v => v + 1)}
            aria-label="Downvote"
            type="button"
          >
            <ArrowDown />
          </button>
          <span className="font-semibold">{downvotes}</span>
          {emoji && <span className="ml-4 text-xl animate-bounce">{emoji}</span>}
          <div className="flex ml-2 gap-1">
            {emojiPicker.map(em => (
              <button
                key={em}
                className="text-xl hover:scale-125 transition-transform"
                aria-label={`react with ${em}`}
                onClick={() => setEmoji(em)}
                type="button"
              >{em}</button>
            ))}
          </div>
          <button className="ml-auto text-xs text-gray-600 underline" onClick={() => setShowReplies(r => !r)} type="button">
            {thread.comments?.length
              ? (showReplies ? "Hide Replies" : `Show Replies (${thread.comments.length})`)
              : "Reply"}
          </button>
        </div>
        {showReplies && thread.comments && thread.comments.length > 0 && (
          <ThreadReplies comments={thread.comments} />
        )}
      </div>
    </div>
  );
}

export default ThreadCard;
