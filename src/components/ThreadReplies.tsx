
import React, { useState } from "react";

function ThreadReplies({ comments = [] }: { comments: any[] }) {
  const [open, setOpen] = useState(false);

  if (!comments.length) {
    return null;
  }

  return (
    <div className="mt-3 pl-8 border-l-2 border-gray-200 dark:border-gray-700 transition-all animate-fade-in">
      {comments.map((comment: any) => (
        <div className="mb-2" key={comment.id}>
          <div className="flex items-center gap-2">
            <img src={comment.avatar} alt={comment.user} className="w-7 h-7 rounded-full border responsive-media" />
            <span className="font-medium">{comment.user}</span>
            <span className="text-xs text-gray-400">{comment.created}</span>
          </div>
          <div className="ml-9 mt-0.5">{comment.text}</div>
          {comment.replies && (
            <div className="pl-8 mt-2 border-l border-gray-100 dark:border-gray-600">
              {comment.replies.map((reply: any) => (
                <div className="flex items-center gap-2 mb-2" key={reply.id}>
                  <img src={reply.avatar} alt={reply.user} className="w-6 h-6 rounded-full border responsive-media" />
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
  );
}

export default ThreadReplies;
