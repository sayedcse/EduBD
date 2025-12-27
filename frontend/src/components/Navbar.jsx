import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import ModalContext from '../context/ModalContext';
import { Menu, LogOut, X } from 'lucide-react';

const Navbar = ({ onMenuClick, isCollapsed, isSidebarOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`z-50 flex justify-between items-center text-[#fffff0] ${isScrolled
                ? `fixed top-4 left-1/2 -translate-x-1/2 w-[90%] transition-none ${user ? (isCollapsed ? 'lg:left-[calc(50%+2.5rem)] lg:w-[calc(100%-9rem)]' : 'lg:left-[calc(50%+8rem)] lg:w-[calc(100%-20rem)]') : ''} max-w-5xl rounded-full glass-panel shadow-2xl px-6 md:px-12 py-3 bg-primary/90 backdrop-blur-xl border border-white/20 animate-slide-down`
                : 'absolute top-0 w-full bg-transparent px-6 md:px-12 py-4'
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Logo - Left Aligned */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold tracking-wide text-white hover:text-accent-yellow transition-colors lg:translate-x-0"
                >
                    EduBD
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Desktop Navigation Links - Hidden on Mobile */}
                <div className="hidden lg:flex items-center gap-4">
                    {user && <Link to="/dashboard" className="text-[#fffff0] hover:text-accent-yellow transition font-medium">Dashboard</Link>}
                    <Link to="/courses" className="text-[#fffff0] hover:text-accent-yellow transition font-medium">Courses</Link>
                </div>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-[#fffff0] font-medium hidden lg:inline">Welcome, {user.username}</span>
                        <button onClick={logout} className="bg-accent-yellow hover:bg-accent-navy hover:text-accent-yellow text-accent-navy px-4 py-2 rounded-md transition duration-300 font-bold text-sm shadow-sm hidden md:block">Logout</button>
                        {/* Mobile Logout Icon */}
                        <button onClick={logout} className="md:hidden text-white hover:text-accent-yellow">
                            <LogOut size={24} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button onClick={() => openModal('login')} className="text-[#fffff0] hover:text-accent-yellow transition font-bold">Login</button>
                        <button onClick={() => openModal('register')} className="bg-accent-yellow hover:bg-accent-yellow/90 text-accent-navy px-4 py-2 rounded-lg transition duration-300 font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Register</button>
                    </>
                )}

                {/* Mobile Menu Button - Right Aligned */}
                {onMenuClick && (
                    <button onClick={onMenuClick} className="lg:hidden text-white hover:text-accent-yellow transition-colors p-1 relative z-10 ml-2">
                        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
