"use client";

import { Post } from "@/types";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-[#30363d] rounded-xl p-6 hover:border-[#388bfd] transition-all shadow-lg shadow-black/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Link
            href={`/user/${post.author?.id || post.user_id}`}
            className="group flex items-center space-x-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-sm font-bold text-white transform group-hover:scale-105 transition-transform">
              {(post.author?.username || "U").charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-[#e6edf3] hover:text-[#58a6ff] transition-colors" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {post.author?.username || "Unknown User"}
            </span>
          </Link>
          {post.author?.isAdmin && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#da3633] to-[#f85149] text-white text-xs rounded-md font-medium shadow-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Admin
            </span>
          )}
          {post.is_promoted && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white text-xs rounded-md font-medium shadow-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Promoted
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {post.created_at
              ? new Date(post.created_at.replace(" ", "T")).toLocaleDateString()
              : "Just now"}
          </span>
        </div>
      </div>
      
      <p className="text-[#e6edf3] mb-4 whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {post.content}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-sm text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="capitalize font-medium">{post.visibility}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 text-sm text-[#7d8590] hover:text-[#58a6ff] transition-colors cursor-pointer" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="font-medium">{post.commentsCount || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-[#21262d] rounded-lg transition-colors group">
            <svg className="w-5 h-5 text-[#7d8590] group-hover:text-[#58a6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
