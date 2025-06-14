
import React, { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const emojiPicker = ["👍", "😂", "🔥", "😢", "👏", "🤔", "💯"];

// Updated threads with images
const INITIAL_THREADS = [
  {
    id: 1,
    user: "Rohit B.",
    avatar: "https://i.pravatar.cc/38?u=rohitb",
    emoji: "🚧",
    title: "Massive pothole near Park Road – dangerous for bikers!",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80", // bridge/pothole
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
    title: "Overflowing bins, 2 days uncollected. Any news?",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", // garbage
    up: 4,
    down: 1,
    hot: true,
    created: "10 min ago",
    comments: []
  },
  {
    id: 3,
    user: "Ankit S.",
    avatar: "https://i.pravatar.cc/38?u=ankits",
    emoji: "💡",
    title: "Streetlights not working for a week in Green Park.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80", // trees w/ light
    up: 10,
    down: 2,
    hot: true,
    created: "22 min ago",
    comments: [],
  },
  {
    id: 4,
    user: "Shweta V.",
    avatar: "https://i.pravatar.cc/38?u=shwetav",
    emoji: "🚰",
    title: "Water main burst again - flooded the lane!",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80", // water
    up: 8,
    down: 1,
    hot: false,
    created: "1 hr ago",
    comments: [],
  },
  {
    id: 5,
    user: "Dev S.",
    avatar: "https://i.pravatar.cc/38?u=devs",
    emoji: "🌳",
    title: "Illegally felled tree! Reported near school gate.",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=600&q=80", // trees
    up: 2,
    down: 0,
    hot: false,
    created: "1 hr ago",
    comments: [],
  },
  {
    id: 6,
    user: "Priya L.",
    avatar: "https://i.pravatar.cc/38?u=priyal",
    emoji: "🐕",
    title: "Pack of stray dogs in main market - dangerous at night.",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80", // stray dog/cat animals
    up: 7,
    down: 6,
    hot: false,
    created: "2 hr ago",
    comments: [],
  }
];

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
        {showReplies && thread.comments && thread.comments.length > 0 &&
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
    </div>
  );
}

const sorter = [
  { label: "Hot", key: "hot" },
  { label: "Recent", key: "recent" },
  { label: "Top", key: "top" },
];

const emojiOptions = [
  { label: "Roadwork", value: "🚧" },
  { label: "Garbage", value: "🗑️" },
  { label: "Light", value: "💡" },
  { label: "Water", value: "🚰" },
  { label: "Tree", value: "🌳" },
  { label: "Animal", value: "🐕" },
  { label: "Other", value: "💭" },
];

const defaultImages = [
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80",
];

const Threads = () => {
  const [tab, setTab] = useState("hot");
  const [threads, setThreads] = useState(INITIAL_THREADS);

  // Add Thread form state
  const [form, setForm] = useState({
    user: "",
    avatar: "",
    emoji: emojiOptions[0].value,
    title: "",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAddThread(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);

    // Demo avatar for user if not provided; could be improved
    const avatar =
      form.avatar ||
      `https://i.pravatar.cc/38?u=${encodeURIComponent(form.user || form.title)}`;
    const image =
      form.image && form.image.startsWith("http")
        ? form.image
        : defaultImages[Math.floor(Math.random() * defaultImages.length)];

    setThreads(ts => [
      {
        id: Date.now(),
        user: form.user || "Anonymous",
        avatar,
        emoji: form.emoji || emojiOptions[0].value,
        title: form.title,
        image,
        up: 0,
        down: 0,
        hot: true,
        created: "just now",
        comments: [],
      },
      ...ts,
    ]);
    setForm({
      user: "",
      avatar: "",
      emoji: emojiOptions[0].value,
      title: "",
      image: "",
    });
    setSubmitting(false);
  }

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
      {/* Add Thread Form */}
      <div className="bg-white/90 dark:bg-muted/70 rounded-xl border border-blue-100 shadow-sm px-7 py-5 mb-5 animate-fade-in">
        <form onSubmit={handleAddThread} className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <Label htmlFor="thread-title">Title</Label>
            <Input
              id="thread-title"
              name="title"
              placeholder="Ex: New civic issue in the area..."
              value={form.title}
              onChange={handleInput}
              required
              maxLength={120}
              className="bg-blue-50"
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[100px]">
            <Label htmlFor="emoji">Emoji</Label>
            <select
              id="emoji"
              name="emoji"
              value={form.emoji}
              onChange={handleInput}
              className="rounded-md border border-blue-300 bg-blue-50 py-2 px-3 text-lg"
            >
              {emojiOptions.map(e => (
                <option value={e.value} key={e.value}>{e.value} {e.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 min-w-[120px]">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              placeholder="Paste image link or leave blank"
              value={form.image}
              onChange={handleInput}
              className="bg-blue-50"
            />
          </div>
          <div className="flex flex-col gap-2 min-w-[120px]">
            <Label htmlFor="user">Your Name</Label>
            <Input
              id="user"
              name="user"
              placeholder="Optional"
              value={form.user}
              onChange={handleInput}
              className="bg-blue-50"
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-tr from-blue-700 via-fuchsia-500 to-pink-500 text-white font-bold px-5 mt-3 md:mt-0"
            disabled={submitting}
          >
            Add Thread
          </Button>
        </form>
      </div>
      {/* Thread List */}
      <div>
        {threads.map(thread => (
          <ThreadCard thread={thread} key={thread.id} />
        ))}
      </div>
    </div>
  );
};

export default Threads;
