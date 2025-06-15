
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Emoji Options
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

// Props: onAddThread (callback)
const AddThreadDialog = ({ onAddThread }: { onAddThread: (thread: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user: "",
    avatar: "",
    emoji: emojiOptions[0].value,
    title: "",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  function handleEmojiPick(val: string) {
    setForm(f => ({ ...f, emoji: val }));
  }
  function handleAddThread(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);

    const avatar =
      form.avatar ||
      `https://i.pravatar.cc/38?u=${encodeURIComponent(form.user || form.title)}`;
    const image =
      form.image && form.image.startsWith("http")
        ? form.image
        : defaultImages[Math.floor(Math.random() * defaultImages.length)];

    onAddThread({
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
    });
    setForm({
      user: "",
      avatar: "",
      emoji: emojiOptions[0].value,
      title: "",
      image: "",
    });
    setSubmitting(false);
    setOpen(false);
  }

  // FAB style and Button style
  const fabIcon =
    "bg-gradient-to-tr from-blue-600 via-fuchsia-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl text-white text-3xl hover:scale-110 focus:scale-105 transition-all border-4 border-white fixed z-30 bottom-5 right-5 md:hidden";
  const desktopButton =
    "hidden md:inline-block bg-gradient-to-tr from-blue-700 via-fuchsia-600 to-pink-400 rounded-full shadow-lg px-6 py-3 text-white font-bold text-lg transition-all hover:scale-105";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ONE button per DialogTrigger, not a fragment */}
      <div>
        <DialogTrigger asChild>
          <button
            type="button"
            className={fabIcon}
            title="Add new thread"
            aria-label="Add thread"
          >
            <Plus className="w-8 h-8" />
          </button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <button
            type="button"
            className={desktopButton}
            title="Start a new thread"
          >
            <Plus className="inline mr-2" />
            New Thread
          </button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-md w-full rounded-3xl shadow-2xl border-0 bg-white/95 dark:bg-muted/95 px-0 py-0 animate-fade-in">
        <form onSubmit={handleAddThread}>
          <DialogHeader className="px-6 pt-7 pb-1">
            <DialogTitle className="flex items-center gap-2 text-blue-900 font-bold text-2xl tracking-tight">
              <span className="text-3xl">{form.emoji}</span> Start a New Thread
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-blue-700">
              Share your civic concern/question with the community.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 px-6 py-5">
            <div>
              <Label htmlFor="thread-title" className="text-md font-semibold">
                Title <span className="text-pink-500">*</span>
              </Label>
              <Input
                id="thread-title"
                name="title"
                placeholder="Ex: New civic issue in the area..."
                value={form.title}
                onChange={handleInput}
                required
                maxLength={100}
                autoFocus
                className="bg-blue-50/60 font-medium border-0 mt-1 text-base"
              />
              <span className="text-xs text-gray-400">{form.title.length}/100</span>
            </div>
            <div>
              <Label htmlFor="emoji" className="font-semibold">
                Type
              </Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {emojiOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(
                      "text-2xl p-2 rounded-full border shadow transition hover:scale-125 hover:bg-blue-100 focus:bg-blue-200 focus:border-blue-400 outline-none",
                      form.emoji === opt.value
                        ? "bg-gradient-to-r from-blue-100 to-pink-100 border-blue-400 scale-110 ring-2 ring-blue-100"
                        : "border-gray-200"
                    )}
                    aria-label={opt.label}
                    onClick={() => handleEmojiPick(opt.value)}
                  >
                    {opt.value}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="image" className="font-semibold">
                Image URL <span className="text-xs text-gray-400">(optional)</span>
              </Label>
              <Input
                id="image"
                name="image"
                placeholder="Paste image link or leave blank"
                value={form.image}
                onChange={handleInput}
                className="bg-blue-50/60 border-0"
              />
            </div>
            <div>
              <Label htmlFor="user" className="font-semibold">
                Your Name
              </Label>
              <Input
                id="user"
                name="user"
                placeholder="Anonymous"
                value={form.user}
                onChange={handleInput}
                className="bg-blue-50/60 border-0"
              />
            </div>
          </div>
          <DialogFooter className="w-full px-6 pb-7 pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-tr from-blue-700 via-fuchsia-500 to-pink-500 text-white font-bold px-5 text-lg rounded-xl shadow-xl active:scale-98"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Thread"}
            </Button>
          </DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-4 right-5 text-gray-400 hover:text-blue-900 p-2 rounded-full bg-white/90 dark:bg-muted transition"
              aria-label="Close"
              tabIndex={-1}
            >
              <X className="w-6 h-6" />
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddThreadDialog;

