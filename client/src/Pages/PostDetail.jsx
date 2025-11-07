import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost } from '../hooks/usePosts';
import { postService } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const { post, loading, error } = usePost(id);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (post && post.comments) {
      setComments(post.comments);
    }
  }, [post]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const newComment = await postService.addComment(id, { content: comment });
      setComments(prev => [...prev, newComment]);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Post not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">
              By {post.author ? post.author.name : 'Unknown Author'}
            </span>
            <span className="mr-4">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.category && (
              <>
                <span className="mr-4">•</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {post.category.name}
                </span>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            <Link
              to="/posts"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Posts
            </Link>
            <Link
              to={`/posts/${post._id}/edit`}
              className="text-green-600 hover:text-green-800"
            >
              Edit Post
            </Link>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Comments Section */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Comments</h3>

          {comments.length > 0 ? (
            <div className="space-y-4 mb-8">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By {comment.author ? comment.author.name : 'Anonymous'} on{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-8">No comments yet. Be the first to comment!</p>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your comment here..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading || !comment.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </section>
      </article>
    </div>
  );
};

export default PostDetail;