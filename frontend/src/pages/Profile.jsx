import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import api from '../api';
import { Eye, EyeOff, Camera, User } from 'lucide-react';

const Profile = () => {
    const { user: authUser, logout, login } = useContext(AuthContext); // access login to update user? or just logout
    const { showNotification } = useContext(NotificationContext);
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    
    // Avatar state
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (authUser) {
            setFormData(prev => ({
                ...prev,
                username: authUser.username,
                email: authUser.email
            }));
            // If authUser has avatar url, set it to preview (assuming backend returns url)
             if (authUser.avatar) {
                 setPreview(authUser.avatar);
             }
        }
    }, [authUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.confirm_password) {
            showNotification("Passwords do not match", 'error');
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        if (formData.password) {
            data.append('password', formData.password);
        }
        if (avatar) {
            data.append('avatar', avatar);
        }

        try {
            const response = await api.put('auth/profile/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showNotification('Profile updated successfully!', 'success');
             // Ideally we should update the global auth context user here with response.data
             // For now, page might show old data until refresh or context update logic is improved
        } catch (err) {
            console.error(err);
            showNotification('Failed to update profile.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-extrabold text-primary mb-8">My Profile</h1>
            
            <div className="glass-panel p-8 max-w-2xl w-full">
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-inner bg-gray-100 flex items-center justify-center text-gray-400">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full cursor-pointer hover:bg-accent-warm transition shadow-md">
                                <Camera size={20} />
                                <input 
                                    id="avatar-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-accent-navy mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-accent-navy font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-accent-navy mb-2">Role</label>
                            <input
                                type="text"
                                value={authUser?.role || ''}
                                disabled
                                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 font-medium cursor-not-allowed uppercase"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-accent-navy mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-accent-navy font-medium"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-xl font-bold text-primary mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-accent-navy mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-accent-navy font-medium pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-accent-navy mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 text-accent-navy font-medium pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
