import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserService } from '../services/UserService';
import { Button } from '../components/ui/button';

export const StudentSettingsPage = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    pictureUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        pictureUrl: user.pictureUrl || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      await UserService.updateUser(user.id, formData);
      
      // Update local storage token if backend returns a new token, but here we just show success
      // If the backend doesn't return a new token but just the user object, we might need to update context.
      // Usually, auth context can refetch user or we just show a message.
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // A full app might update the AuthContext's user object here
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setMessage({ text: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">Update your profile information</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <div className={`rounded-md p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="flex items-center gap-6">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50">
              {formData.pictureUrl ? (
                <img src={formData.pictureUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-400">
                  {formData.name?.charAt(0) || user.email?.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Profile Picture URL</label>
              <input
                type="text"
                value={formData.pictureUrl}
                onChange={(e) => setFormData({ ...formData, pictureUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
