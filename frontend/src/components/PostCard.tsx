"use client";

import { Post } from "@/types";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Link
            href={`/user/${post.author?.id || post.user_id}`}
            className="font-semibold hover:underline text-gray-900"
          >
            {post.author?.username || "Unknown User"}
          </Link>
          {post.author?.isAdmin && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
              Admin
            </span>
          )}
          {post.is_promoted && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              Promoted
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {post.created_at
            ? new Date(post.created_at.replace(" ", "T")).toLocaleDateString()
            : "Just now"}
        </span>
      </div>
      <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="capitalize">{post.visibility}</span>
        <span>{post.commentsCount || 0} comments</span>
      </div>
    </div>
  );
}
