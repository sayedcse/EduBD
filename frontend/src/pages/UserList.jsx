import { useState, useEffect, useContext } from 'react';
import api from '../api';
import NotificationContext from '../context/NotificationContext';
import AuthContext from '../context/AuthContext';
import { Trash2, User, UserCheck, Shield } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { showNotification } = useContext(NotificationContext);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('auth/users/');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            showNotification("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`auth/users/${userToDelete.id}/`);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            showNotification("User deleted successfully", "success");
            setDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            showNotification("Failed to delete user", "error");
        }
    };

    const filteredUsers = filterRole === 'all'
        ? users
        : users.filter(user => user.role === filterRole);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container mx-auto p-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage platform users and permissions</p>
                </div>

                <div className="flex items-center gap-2 glass-panel p-1 border border-white/40 shadow-sm">
                    {['all', 'student', 'instructor', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${filterRole === role
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Role</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150 group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-accent-warm/10 flex items-center justify-center text-accent-warm font-bold border border-accent-warm/20 overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.username.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                user.role === 'instructor' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    'bg-green-100 text-green-800 border-green-200'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} className="mr-1" />}
                                                {user.role === 'instructor' && <UserCheck size={12} className="mr-1" />}
                                                {user.role === 'student' && <User size={12} className="mr-1" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        No users found matching filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4 p-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="bg-white/50 rounded-xl p-4 border border-white/40 shadow-sm flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-12 h-12 rounded-full bg-accent-warm/10 flex items-center justify-center text-accent-warm font-bold border border-accent-warm/20 overflow-hidden shrink-0">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-gray-900 truncate">{user.username}</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border shrink-0 ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                                user.role === 'instructor' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    'bg-green-100 text-green-800 border-green-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>

                                {user.id !== currentUser?.id && (
                                    <button
                                        onClick={() => confirmDelete(user)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No users found matching filter.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-right text-xs text-gray-400">
                Total Users: {filteredUsers.length}
            </div>

            {/* Delete Confirmation Modal (Reusable) */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={executeDelete}
                title="Delete User?"
                message={`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
};

export default UserList;
