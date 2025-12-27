import { useState, useContext, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import { X, User, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const AuthModal = () => {
    const { isModalOpen, modalView, closeModal, setModalView } = useModal();
    const { login } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [loading, setLoading] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset form when modal opens or view changes
    useEffect(() => {
        if (isModalOpen) {
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                confirm_password: '',
                role: 'student'
            });
            setLoading(false);
        }
    }, [isModalOpen, modalView]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            showNotification('Welcome back!', 'success');
            closeModal();
        } catch (error) {
            console.error(error);
            showNotification('Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            showNotification("Passwords do not match", 'error');
            return;
        }
        setLoading(true);
        try {
            await api.post('auth/register/', {
                username: formData.username,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
                role: formData.role
            });
            showNotification('Registration successful! Please login.', 'success');
            setModalView('login');
        } catch (error) {
            console.error(error);
            showNotification('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('auth/password-reset/', { email: formData.email });
            showNotification('If an account exists, a reset link has been sent.', 'success');
            setModalView('login');
        } catch (error) {
            showNotification('Failed to send reset email.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2, ease: "easeInOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const renderLogin = () => (
        <motion.form
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleLogin}
            className="space-y-6"
        >
            <h2 className="text-3xl font-extrabold text-primary-dark mb-6 text-center">Welcome Back</h2>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                    <User size={20} />
                </div>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" required />
            </div>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                    <Lock size={20} />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/60 hover:text-primary transition-colors focus:outline-none"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <div className="text-right">
                <button type="button" onClick={() => setModalView('forgot-password')} className="text-sm font-bold text-primary hover:text-accent-yellow transition-colors">Forgot Password?</button>
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all shadow-md"
            >
                {loading ? 'Logging in...' : 'Login'}
            </motion.button>
            <p className="text-center text-sm text-primary/80 mt-4 font-medium">Don't have an account? <button type="button" onClick={() => setModalView('register')} className="font-bold text-accent-yellow hover:text-accent-yellow/80 hover:underline transition-colors">Register</button></p>
        </motion.form>
    );

    const renderRegister = () => (
        <motion.form
            key="register"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleRegister}
            className="space-y-4"
        >
            <h2 className="text-3xl font-extrabold text-primary-dark mb-4 text-center">Create Account</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative"><User className="absolute left-3 top-3 text-primary" size={20} /><input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" /></div>
                <div className="relative"><User className="absolute left-3 top-3 text-primary" size={20} /><input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" /></div>
            </div>
            <div className="relative"><User className="absolute left-3 top-3 text-primary" size={20} /><input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" required /></div>
            <div className="relative"><Mail className="absolute left-3 top-3 text-primary" size={20} /><input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" required /></div>
            <div className="relative"><Shield className="absolute left-3 top-3 text-primary" size={20} />
                <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark bg-white/20 font-medium border-primary/20 cursor-pointer">
                    <option value="student" className="text-primary-dark">Student</option>
                    <option value="instructor" className="text-primary-dark">Instructor</option>
                    <option value="admin" className="text-primary-dark">Admin</option>
                </select>
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-primary" size={20} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-primary/60 hover:text-primary transition-colors focus:outline-none"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-primary" size={20} />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-primary/60 hover:text-primary transition-colors focus:outline-none"
                >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-accent-yellow text-primary-dark font-extrabold py-3 rounded-xl hover:shadow-lg transition-all shadow-md"
            >
                {loading ? 'Creating Account...' : 'Register'}
            </motion.button>
            <p className="text-center text-sm text-primary/80 mt-4 font-medium">Already have an account? <button type="button" onClick={() => setModalView('login')} className="font-bold text-accent-warm hover:text-accent-warm/80 hover:underline transition-colors">Login</button></p>
        </motion.form >
    );

    const renderForgotPassword = () => (
        <motion.form
            key="forgot-password"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleForgotPassword}
            className="space-y-6"
        >
            <h2 className="text-3xl font-extrabold text-primary-dark mb-2 text-center">Reset Password</h2>
            <p className="text-primary font-medium text-center mb-4">Enter your email to receive a reset link.</p>
            <div className="relative"><Mail className="absolute left-3 top-3 text-primary" size={20} /><input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-primary-dark font-medium placeholder-primary/60 border-primary/20" required /></div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all shadow-md"
            >
                {loading ? 'Sending...' : 'Send Link'}
            </motion.button>
            <p className="text-center text-sm text-primary/80 mt-4"><button type="button" onClick={() => setModalView('login')} className="font-bold text-accent-yellow hover:underline">Back to Login</button></p>
        </motion.form>
    );

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        className="glass-panel p-8 rounded-[20px] w-full max-w-[500px] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/40 overflow-hidden"
                    >
                        <button onClick={closeModal} className="absolute top-5 right-5 text-primary/60 hover:text-accent-warm transition-colors hover:rotate-90 transform duration-300 z-10">
                            <X size={26} strokeWidth={2.5} />
                        </button>

                        <AnimatePresence mode="wait">
                            {modalView === 'login' && renderLogin()}
                            {modalView === 'register' && renderRegister()}
                            {modalView === 'forgot-password' && renderForgotPassword()}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
