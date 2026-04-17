import { useState, useEffect } from 'react';
import { UserService } from '../services/UserService';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';
import { Pencil, Trash2, X, UserPlus, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '../components/ui/button';

export const UsersListPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Edit State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Create State
  const [creatingUser, setCreatingUser] = useState(false);
  const [createData, setCreateData] = useState({
    name: '', email: '', password: '', roles: ['STUDENT'], employeeId: '', department: ''
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Delete State
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const isAdmin = currentUser?.roles.includes('ADMIN');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsers();
      // Adjusting to handle if the API returns a UserListDto which has .users array
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditData({ 
      name: user.name || '', 
      pictureUrl: user.pictureUrl || '',
      roles: user.roles || [],
      enabled: user.enabled ?? true
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditData({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setEditSubmitting(true);
      await UserService.updateUser(editingUser.id, editData as Record<string, unknown>);
      await fetchUsers();
      closeEditModal();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreateSubmitting(true);
      await UserService.createUser(createData);
      await fetchUsers();
      setCreatingUser(false);
      setCreateData({ name: '', email: '', password: '', roles: ['STUDENT'], employeeId: '', department: '' });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUserId) return;
    try {
      setDeleteSubmitting(true);
      await UserService.deleteUser(deletingUserId);
      await fetchUsers();
      setDeletingUserId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'ALL' || (u.roles && u.roles.includes(roleFilter));
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
        {isAdmin && (
          <Button onClick={() => setCreatingUser(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        )}
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-4 rounded-lg border border-slate-300 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>

        <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 p-1">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Info</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Login</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.pictureUrl ? (
                        <img src={u.pictureUrl} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold uppercase shrink-0">
                          {u.name?.charAt(0) || u.email?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles?.map((role) => (
                        <span key={role} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {u.department && <div className="text-slate-700">Dept: {u.department}</div>}
                    {u.employeeId && <div className="text-slate-500">Emp ID: {u.employeeId}</div>}
                    {u.faculty && <div className="text-slate-700">Fac: {u.faculty}</div>}
                    {u.studentRegistrationNumber && <div className="text-slate-500">Reg: {u.studentRegistrationNumber}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {u.enabled !== false ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setDeletingUserId(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((u) => (
            <div key={u.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow relative">
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-1">
                  <button 
                    onClick={() => openEditModal(u)}
                    className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setDeletingUserId(u.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center mt-2 mb-4">
                {u.pictureUrl ? (
                  <img src={u.pictureUrl} alt={u.name} className="h-16 w-16 rounded-full object-cover mb-3 shadow-sm ring-2 ring-white" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-xl font-bold uppercase mb-3 shadow-sm ring-2 ring-white">
                    {u.name?.charAt(0) || u.email?.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-slate-900 truncate w-full px-2">{u.name}</h3>
                <p className="text-sm text-slate-500 truncate w-full px-2">{u.email}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {u.roles?.map((role) => (
                  <span key={role} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {role}
                  </span>
                ))}
                {u.enabled !== false ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Active</span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600 ring-1 ring-inset ring-slate-500/20">Inactive</span>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-2">
                {u.department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dept</span>
                    <span className="font-medium text-slate-700">{u.department}</span>
                  </div>
                )}
                {u.employeeId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emp ID</span>
                    <span className="font-medium text-slate-700">{u.employeeId}</span>
                  </div>
                )}
                {u.faculty && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Faculty</span>
                    <span className="font-medium text-slate-700">{u.faculty}</span>
                  </div>
                )}
                {u.studentRegistrationNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reg No</span>
                    <span className="font-medium text-slate-700">{u.studentRegistrationNumber}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                  <span className="text-slate-500">Last Login</span>
                  <span className="font-medium text-slate-700">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
              No users found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {creatingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New User</h2>
              <button onClick={() => setCreatingUser(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name *</label>
                  <input
                    type="text" required
                    value={createData.name}
                    onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                  <input
                    type="email" required
                    value={createData.email}
                    onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password *</label>
                <input
                  type="password" required minLength={6}
                  value={createData.password}
                  onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Role *</label>
                <div className="flex gap-3">
                  {['ADMIN', 'STAFF', 'STUDENT'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="create-role"
                        checked={createData.roles.includes(role)}
                        onChange={() => setCreateData({...createData, roles: [role]})}
                        className="text-cyan-600 focus:ring-cyan-600 cursor-pointer"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              {(createData.roles.includes('STAFF') || createData.roles.includes('ADMIN')) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Employee ID</label>
                    <input
                      type="text"
                      value={createData.employeeId}
                      onChange={(e) => setCreateData({ ...createData, employeeId: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
                    <input
                      type="text"
                      value={createData.department}
                      onChange={(e) => setCreateData({ ...createData, department: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCreatingUser(false)}>Cancel</Button>
                <Button type="submit" disabled={createSubmitting || createData.roles.length === 0}>
                  {createSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit User ({editingUser.name})</h2>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  required
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <div className="flex gap-3">
                  {['ADMIN', 'STAFF', 'STUDENT'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio"
                        name="edit-role"
                        checked={(editData.roles || []).includes(role)}
                        onChange={() => setEditData({...editData, roles: [role]})}
                        className="text-cyan-600 focus:ring-cyan-600 cursor-pointer"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mt-4">
                    <input 
                      type="checkbox" 
                      checked={editData.enabled ?? true}
                      onChange={(e) => setEditData({...editData, enabled: e.target.checked})}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
                    />
                    Account Enabled
                  </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeEditModal}>Cancel</Button>
                <Button type="submit" disabled={editSubmitting || (editData.roles?.length === 0)}>
                  {editSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-slate-900">Confirm Deletion</h2>
            <p className="mb-6 text-slate-600">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingUserId(null)}>Cancel</Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={confirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
