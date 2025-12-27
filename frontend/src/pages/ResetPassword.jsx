import { useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { useModal } from '../context/ModalContext'; // Import useModal

const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const { openModal } = useModal(); // Get openModal
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await api.patch('auth/password-reset-confirm/', {
                password,
                token,
                uidb64: uid
            });
            setMessage('Password reset successfully! Opening login...');
            setTimeout(() => {
                navigate('/');
                openModal('login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Link might be invalid or expired.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md animate-fade-in-up backdrop-blur-md">
                <h2 className="text-3xl font-extrabold text-primary-dark mb-2 text-center">Reset Password</h2>
                <p className="text-primary/70 text-center mb-8">Enter your new password below.</p>

                {message && <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 border border-green-200">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">New Password</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 group-focus-within:text-secondary transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark placeholder-primary/40 pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-secondary focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-2">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 group-focus-within:text-secondary transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all glass-input text-primary-dark placeholder-primary/40 pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-secondary focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-accent-warm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Reseting...' : 'Set New Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
