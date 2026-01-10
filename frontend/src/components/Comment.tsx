'use client';

import { useState } from 'react';
import { Comment as CommentType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { commentService } from '@/services/api';

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Safe access to comment properties
  const username = comment.user?.username || 'Unknown';
  const isOwner = user?.id === comment.user_id;
  const isAdmin = user?.isAdmin;
  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!canDelete) return;
    
    setDeleting(true);
    try {
      await commentService.delete(comment.id);
      onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'unknown';
    }
  };

  return (
    <div className="flex space-x-3 py-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center text-xs font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-semibold text-[#e6edf3]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {username}
          </span>
          <span className="text-xs text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {formatDate(comment.created_at)}
          </span>
          {isOwner && (
            <span className="text-xs px-1.5 py-0.5 bg-[#1f6feb] text-white rounded" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              You
            </span>
          )}
        </div>

        <p className="text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {comment.content}
        </p>

        {/* Actions */}
        {canDelete && (
          <div className="flex items-center space-x-3 mt-2">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-[#f85149] hover:text-[#ff7b72] transition-colors"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                Delete
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Are you sure?
                </span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs text-[#f85149] hover:text-[#ff7b72] disabled:opacity-50"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {deleting ? 'Deleting...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs text-[#7d8590] hover:text-[#e6edf3]"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}