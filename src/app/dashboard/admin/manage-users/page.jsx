"use client";

import { useEffect, useState } from "react";
import { getAdminUsersList, updateUserRole, deleteUserAccount } from "@/actions/users";
import { useSession } from "@/lib/auth-client";
import { UserCheck, Trash2, ShieldCheck, Mail, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsersList();
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Update user role handler
  const handleRoleChange = async (userId, currentRole) => {
    if (userId === session.user.id) {
      toast.error("You cannot change your own role!");
      return;
    }

    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`User role updated to ${newRole}`);
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  // Delete user account handler
  const handleDeleteUser = async () => {
    if (!deleteId) return;
    if (deleteId === session.user.id) {
      toast.error("You cannot delete your own account!");
      setDeleteId(null);
      return;
    }

    setDeleting(true);
    try {
      const res = await deleteUserAccount(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("User account and associated content deleted successfully.");
        setUsers(users.filter((u) => u.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      toast.error("Failed to delete user account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          User Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Promote users to administrative privileges or delete accounts from the database.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full mb-3" />
          <span className="text-xs text-slate-400">Loading directory...</span>
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-400 py-10 text-center">No users registered on the platform.</p>
      ) : (
        /* Users Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">User Details</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2 text-center">Lessons Published</th>
                <th className="py-3 px-2 text-center">Current Role</th>
                <th className="py-3 px-2 text-center">Moderate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-slate-300">
              {users.map((u) => (
                <tr key={u.id || u._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.image ? (
                          <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium">{u.email}</td>
                  
                  {/* Total Lessons Created */}
                  <td className="py-3 px-2 text-center font-bold text-slate-200">
                    {u.lessonCount || 0}
                  </td>

                  {/* Current Role Badge */}
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      u.role === "admin"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {u.role === "admin" && <ShieldCheck size={11} />}
                      <span>{u.role}</span>
                    </span>
                  </td>

                  {/* Actions (Promote / Delete) */}
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* Toggle Role Button */}
                      <button
                        onClick={() => handleRoleChange(u.id, u.role)}
                        disabled={u.id === session?.user?.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/35 text-slate-400 hover:text-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
                        title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                      >
                        Change Role
                      </button>

                      {/* Delete Account */}
                      <button
                        onClick={() => setDeleteId(u.id)}
                        disabled={u.id === session?.user?.id}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/10 border border-slate-700/30 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Delete User Account"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <ShieldAlert size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Delete User Account?</h3>
            <p className="text-xs text-slate-400">
              Are you sure? This will permanently delete this user account and all of their created lessons, comments, and reports.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-850 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <span>Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
