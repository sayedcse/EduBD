import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, BookOpen, PlusCircle, Users, LogOut, Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const baseClasses = `flex items-center pl-[14px] pr-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-1`;

    const getActiveClass = (path) => {
        return location.pathname === path
            ? 'bg-secondary text-white shadow-lg shadow-secondary/30 backdrop-blur-sm font-bold'
            : 'text-primary hover:bg-primary/10 hover:text-primary-dark font-semibold';
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`
                glass-panel bg-white/40 backdrop-blur-xl text-primary flex flex-col h-screen fixed left-0 top-0 z-[100] border-r border-white/50
                transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'w-20' : 'w-64'}
                ${user ? 'lg:translate-x-0' : 'lg:-translate-x-full lg:hidden'} lg:fixed lg:h-screen lg:glass-panel-reset
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 lg:hidden text-primary hover:bg-white/20 rounded-full z-[60]"
                >
                    <X size={20} />
                </button>

                {/* Desktop Collapse Button - Centered on Border */}
                <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md border border-white/40 text-white p-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] z-[60] hover:bg-white/40 transition-all hover:scale-110 items-center justify-center"
                >
                    {isCollapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
                </button>

                {/* Scrollable Content Container */}
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden w-full">
                    {/* Brand */}
                    <div className={`p-6 pl-6 flex`}>
                        <div className="flex items-center">
                            <div className="bg-accent-warm w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg shrink-0 z-10">E</div>
                            <div className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
                                <Link to="/" onClick={onClose}><h1 className="text-xl font-bold tracking-wider text-primary hover:text-primary-dark transition-colors">EduBD</h1></Link>
                                <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold">LMS Platform</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link to="/dashboard" onClick={onClose} className={`${baseClasses} ${getActiveClass('/dashboard')}`} title={isCollapsed ? "Dashboard" : ""}>
                            <LayoutDashboard size={20} strokeWidth={1.5} className="shrink-0" />
                            <span className={`font-bold text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>Dashboard</span>
                        </Link>
                        <Link to="/courses" onClick={onClose} className={`${baseClasses} ${getActiveClass('/courses')}`} title={isCollapsed ? "All Courses" : ""}>
                            <BookOpen size={20} strokeWidth={1.5} className="shrink-0" />
                            <span className={`font-bold text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>All Courses</span>
                        </Link>
                        {user?.role === 'instructor' && (
                            <Link to="/courses/new" onClick={onClose} className={`${baseClasses} ${getActiveClass('/courses/new')}`} title={isCollapsed ? "Create Course" : ""}>
                                <PlusCircle size={20} strokeWidth={1.5} className="shrink-0" />
                                <span className={`font-bold text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>Create Course</span>
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/users" onClick={onClose} className={`${baseClasses} ${getActiveClass('/users')}`} title={isCollapsed ? "Manage Users" : ""}>
                                <Users size={20} strokeWidth={1.5} className="shrink-0" />
                                <span className={`font-bold text-sm transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>Manage Users</span>
                            </Link>
                        )}
                    </nav>

                    {/* User Profile Card (Bottom) */}
                    <div className="p-4 bg-white/10 backdrop-blur-[2px] mt-auto">
                        {user ? (
                            <div className={`bg-white/40 border border-white/60 rounded-xl pl-1 py-4 text-primary flex items-center shadow-lg backdrop-blur-md`}>
                                <div className="w-10 h-10 rounded-full bg-accent-warm text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-sm shrink-0 z-10">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{user.username.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-3'}`}>
                                    <p className="font-bold text-sm truncate text-primary-dark">{user.username}</p>
                                    <p className="text-[10px] uppercase font-bold text-primary/70">{user.role}</p>
                                </div>
                                <button onClick={logout} className={`text-accent-warm hover:text-red-500 transition shrink-0 ${isCollapsed ? 'hidden' : 'block ml-2'}`} title="Logout">
                                    <LogOut size={20} strokeWidth={1.5} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={onClose} className="block text-center bg-accent-warm py-2 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition">
                                {isCollapsed ? <LogOut size={20} className="mx-auto" /> : 'Login'}
                            </Link>
                        )}

                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
