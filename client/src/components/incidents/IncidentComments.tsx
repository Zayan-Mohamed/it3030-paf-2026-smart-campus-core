import { useEffect, useState } from 'react';
import { MessageSquare, Pencil, Save, Trash2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { IncidentComment } from '../../types';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

const API_BASE_URL = 'http://localhost:8080';

type IncidentCommentsProps = {
  incidentId: number;
};

export const IncidentComments = ({ incidentId }: IncidentCommentsProps) => {
  const { token } = useAuth();
  const [comments, setComments] = useState<IncidentComment[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v1/incidents/${incidentId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Failed to load comments');
      }

      const payload = (await response.json()) as IncidentComment[];
      setComments(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      void loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, incidentId, token]);

  const addComment = async () => {
    if (!token) {
      return;
    }

    const content = newComment.trim();
    if (!content) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v1/incidents/${incidentId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Failed to add comment');
      }

      const payload = (await response.json()) as IncidentComment;
      setComments((prev) => [...prev, payload]);
      setNewComment('');
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to add comment');
    }
  };

  const startEditing = (comment: IncidentComment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const saveEdit = async (commentId: number) => {
    if (!token) {
      return;
    }

    const content = editingText.trim();
    if (!content) {
      setError('Comment content cannot be empty.');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v1/incidents/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Failed to update comment');
      }

      const payload = (await response.json()) as IncidentComment;
      setComments((prev) => prev.map((comment) => (comment.id === payload.id ? payload : comment)));
      cancelEditing();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update comment');
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!token) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/v1/incidents/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok && response.status !== 204) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? 'Failed to delete comment');
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete comment');
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </button>
      </div>

      {expanded ? (
        <div className="space-y-3">
          {loading ? <p className="text-xs text-slate-500">Loading comments...</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Add a comment..."
              className="min-h-20 bg-white"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={addComment}>Add Comment</Button>
            </div>
          </div>

          {comments.length === 0 && !loading ? <p className="text-xs text-slate-500">No comments yet.</p> : null}

          <div className="space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-700">{comment.authorName}</p>
                  <p className="text-[11px] text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingText}
                      onChange={(event) => setEditingText(event.target.value)}
                      className="min-h-20"
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="mr-1 h-3.5 w-3.5" />Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEdit(comment.id)}>
                        <Save className="mr-1 h-3.5 w-3.5" />Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                    {(comment.canEdit || comment.canDelete) ? (
                      <div className="mt-2 flex justify-end gap-2">
                        {comment.canEdit ? (
                          <Button size="sm" variant="outline" onClick={() => startEditing(comment)}>
                            <Pencil className="mr-1 h-3.5 w-3.5" />Edit
                          </Button>
                        ) : null}
                        {comment.canDelete ? (
                          <Button size="sm" variant="destructive" onClick={() => deleteComment(comment.id)}>
                            <Trash2 className="mr-1 h-3.5 w-3.5" />Delete
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
