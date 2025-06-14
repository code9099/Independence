
import React, { useState } from "react";
import { ArrowUp, ArrowDown, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_THREADS = [
  {
    id: 1,
    user: "Rohit B.",
    avatar: "https://i.pravatar.cc/38?u=rohitb",
    emoji: "🚧",
    title: "Massive pothole near Park Road – dangerous for bikers!",
    up: 7,
    down: 0,
    hot: true,
    created: "3 min ago",
    comments: [
      {
        id: 11,
        user: "Sana F.",
        avatar: "https://i.pravatar.cc/38?u=sanaf",
        text: "That one nearly threw me off my scooter 😬!",
        created: "2 min ago",
        replies: [
          {
            id: 111,
            user: "Chirag D.",
            avatar: "https://i.pravatar.cc/38?u=chiragd",
            text: "I informed PWD, hope it gets fixed soon!",
            created: "1 min ago"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    user: "Meera P.",
    avatar: "https://i.pravatar.cc/38?u=meerak",
    emoji: "🗑️",
    title: "Overflowing bins 2 days uncollected. Any news?",
    up: 3,
    down: 1,
    hot: false,
    created: "10 min ago",
    comments: []
  },
];

const emojiPicker = ["👍", "😂", "🔥", "😢", "👏", "🤔", "💯"];

function ThreadCard({ thread }: { thread: any }) {
  const [upvotes, setUpvotes] = useState(thread.up);
  const [downvotes, setDownvotes] = useState(thread.down);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="bg-white dark:bg-muted/80 rounded-xl px-6 py-5 mb-3 shadow border border-blue-50 animate-fade-in relative">
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
        >
          <ArrowUp />
        </button>
        <span className="font-semibold">{upvotes}</span>
        <button
          className={cn("rounded-full p-1 hover:bg-orange-100", downvotes > thread.down && "bg-orange-200")}
          onClick={() => setDownvotes(v => v + 1)}
          aria-label="Downvote"
        >
          <ArrowDown />
        </button>
        <span className="font-semibold">{downvotes}</span>
        {emoji &&
          <span className="ml-4 text-xl animate-bounce">{emoji}</span>
        }
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
        <button className="ml-auto text-xs text-gray-600 underline" onClick={() => setShowReplies(r => !r)}>
          {thread.comments.length ? (showReplies ? "Hide Replies" : `Show Replies (${thread.comments.length})`) : "Reply"}
        </button>
      </div>
      {showReplies && thread.comments.length > 0 &&
        <div className="mt-3 pl-8 border-l-2 border-gray-200 dark:border-gray-700 transition-all animate-fade-in">
          {thread.comments.map((comment: any) => (
            <div className="mb-2" key={comment.id}>
              <div className="flex items-center gap-2">
                <img src={comment.avatar} alt={comment.user} className="w-7 h-7 rounded-full border" />
                <span className="font-medium">{comment.user}</span>
                <span className="text-xs text-gray-400">{comment.created}</span>
              </div>
              <div className="ml-9 mt-0.5">{comment.text}</div>
              {comment.replies && (
                <div className="pl-8 mt-2 border-l border-gray-100 dark:border-gray-600">
                  {comment.replies.map((reply: any) => (
                    <div className="flex items-center gap-2 mb-2" key={reply.id}>
                      <img src={reply.avatar} alt={reply.user} className="w-6 h-6 rounded-full border" />
                      <span className="font-medium">{reply.user}</span>
                      <span className="ml-1">{reply.text}</span>
                      <span className="text-xs text-gray-400">{reply.created}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      }
    </div>
  );
}

const sorter = [
  { label: "Hot", key: "hot" },
  { label: "Recent", key: "recent" },
  { label: "Top", key: "top" },
];

const Threads = () => {
  const [tab, setTab] = useState("hot");
  return (
    <div className="w-full">
      <div className="flex items-center gap-6 mb-2">
        {sorter.map(s => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={cn(
              "text-lg font-semibold pb-1 border-b-2 transition-all",
              tab === s.key ? "border-blue-700 text-blue-900" : "border-transparent text-gray-500 hover:text-blue-600"
            )}
            type="button"
          >
            {s.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">Community Threads</span>
      </div>
      <div>
        {DEFAULT_THREADS.map(thread => (
          <ThreadCard thread={thread} key={thread.id} />
        ))}
      </div>
    </div>
  );
};

export default Threads;
