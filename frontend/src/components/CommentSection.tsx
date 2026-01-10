'use client';

import { useState, useEffect } from 'react';
import { Comment as CommentType } from '@/types';
import { commentService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext'; // ADICIONE ESTA LINHA
import Comment from './Comment';

interface CommentSectionProps {
  postId: number;
  initialCount?: number;
}

export default function CommentSection({ postId, initialCount = 0 }: CommentSectionProps) {
  const { user } = useAuth(); // ADICIONE ESTA LINHA
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getByPostId(postId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPosting(true);
    setError('');

    try {
      const result = await commentService.create(postId, newComment.trim());
      
      // CORREÇÃO: Adiciona dados do usuário manualmente
      const commentWithUser = {
        ...result.comment,
        user: result.comment.user || {
          id: user?.id,
          username: user?.username,
          trustScore: user?.trustScore || 0
        }
      };
      
      setComments([...comments, commentWithUser]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = (commentId: number) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#30363d]">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-lg focus:ring-2 focus:ring-[#1f6feb] focus:border-transparent resize-none placeholder-[#7d8590] text-sm"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            rows={2}
            disabled={posting}
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#238636] to-[#2ea043] text-white rounded-lg hover:from-[#2ea043] hover:to-[#3fb950] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium self-start"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {posting ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Post'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-[#f85149]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {error}
          </p>
        )}
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-[#7d8590]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-3 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm text-[#7d8590]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}