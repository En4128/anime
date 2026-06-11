import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm } from 'react-hook-form';
import { commentsApi } from '../../api/comments.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

dayjs.extend(relativeTime);

const CommentSection = ({ animeId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data } = await commentsApi.list(animeId);
      setComments(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animeId) {
      loadComments();
    }
  }, [animeId]);

  const onSubmit = async (form) => {
    if (!isAuthenticated) return;
    await commentsApi.create(animeId, form);
    reset();
    loadComments();
  };

  const handleDelete = async (commentId) => {
    await commentsApi.remove(commentId);
    loadComments();
  };

  const handleLike = async (commentId) => {
    await commentsApi.like(commentId);
    loadComments();
  };

  return (
    <section className="space-y-4 rounded-2xl border border-white/5 bg-secondary/30 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Comments</h3>
        <span className="text-sm text-white/60">{comments.length} entries</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <textarea
            {...register('content', { required: true })}
            rows={3}
            placeholder="Share your thoughts..."
            className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-secondary disabled:opacity-50"
            disabled={loading}
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-sm text-white/60">Sign in to join the discussion.</p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <article key={comment._id} className="rounded-xl border border-white/5 bg-black/30 p-3">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{comment.user?.username || 'User'}</span>
              <span>{dayjs(comment.createdAt).fromNow()}</span>
            </div>
            <p className="mt-2 text-sm text-white/90">{comment.content}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
              <button type="button" onClick={() => handleLike(comment._id)} className="hover:text-primary">
                ❤️ {comment.likes?.length || 0}
              </button>
              {user?._id === comment.user?._id && (
                <button type="button" onClick={() => handleDelete(comment._id)} className="text-red-400">
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
        {!comments.length && <p className="text-sm text-white/60">No comments yet.</p>}
      </div>
    </section>
  );
};

export default CommentSection;

