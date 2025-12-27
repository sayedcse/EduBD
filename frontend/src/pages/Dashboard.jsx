import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, Shield, UserCheck, User, ArrowRight, Clock, PlayCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('lms/dashboard/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();

        if (user?.role === 'student') {
            const fetchEnrollments = async () => {
                try {
                    const response = await api.get('lms/enrollments/');
                    setEnrolledCourses(response.data);
                } catch (error) {
                    console.error("Error fetching enrollments", error);
                }
            };
            fetchEnrollments();
        }
    }, [user]);

    return (
        <div>
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                        <div className="glass-card p-6 rounded-2xl border-l-8 border-secondary relative overflow-hidden group">
                            <div className="absolute right-4 top-4 opacity-10 text-secondary group-hover:scale-110 transition-transform duration-500">
                                <Users size={64} />
                            </div>
                            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                <Users size={16} /> Total Users
                            </h3>
                            <p className="text-4xl font-extrabold text-primary-dark">{stats.total_users}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-l-8 border-accent-warm relative overflow-hidden group delay-100 animate-fade-in-up">
                            <div className="absolute right-4 top-4 opacity-10 text-accent-warm group-hover:scale-110 transition-transform duration-500">
                                <BookOpen size={64} />
                            </div>
                            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                <BookOpen size={16} /> Active Courses
                            </h3>
                            <p className="text-4xl font-extrabold text-primary-dark">{stats.total_courses}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-l-8 border-primary relative overflow-hidden group delay-200 animate-fade-in-up">
                             <div className="absolute right-4 top-4 opacity-10 text-primary group-hover:scale-110 transition-transform duration-500">
                                <GraduationCap size={64} />
                            </div>
                            <h3 className="text-primary text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                <GraduationCap size={16} /> Enrollments
                            </h3>
                            <p className="text-4xl font-extrabold text-primary-dark">{stats.total_enrollments}</p>
                        </div>
                    </div>

                    {user?.role === 'student' && enrolledCourses.length > 0 && (
                        <div className="mb-8 animate-fade-in-up delay-300">
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <BookOpen size={20} /> My Enrolled Courses
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledCourses.map((enrollment, index) => (
                                    <div key={enrollment.id} className="glass-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1">
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                 <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                                                    {enrollment.course_detail?.category_detail?.name || 'General'}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-primary-dark mb-2 line-clamp-2">{enrollment.course_title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{enrollment.course_detail?.description}</p>
                                            
                                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
                                                <span className="flex items-center gap-1"><User size={12} /> {enrollment.course_detail?.instructor_name}</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> {enrollment.course_detail?.duration || 'Self-Paced'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/30 border-t border-white/50 mt-auto backdrop-blur-sm">
                                            <Link to={`/courses/${enrollment.course}`} className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 text-sm group shadow-lg">
                                                <PlayCircle size={16} className="group-hover:scale-110 transition-transform" /> Continue Learning
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-400">
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Users size={20} /> User Distribution
                            </h3>
                            <div className="space-y-4">
                                {stats.role_distribution.map((roleStat, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/60 transition hover-scale border border-white/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${roleStat.role === 'admin' ? 'bg-red-100 text-red-600' : roleStat.role === 'instructor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {roleStat.role === 'admin' && <Shield size={16} />}
                                                {roleStat.role === 'instructor' && <UserCheck size={16} />}
                                                {roleStat.role === 'student' && <User size={16} />}
                                            </div>
                                            <span className="font-medium text-gray-700 capitalize">{roleStat.role}</span>
                                        </div>
                                        <span className="font-bold text-primary-dark bg-white/60 px-3 py-1 rounded-full shadow-sm border border-white/50">{roleStat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <BookOpen size={20} /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <Link to="/courses" className="flex items-center justify-between p-4 bg-blue-50/50 text-blue-800 rounded-xl hover:bg-blue-100/70 transition font-bold group hover-scale border border-blue-100/50">
                                    <span className="flex items-center gap-3">
                                        <BookOpen size={20} /> View All Courses
                                    </span>
                                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition" />
                                </Link>
                                <Link to="/profile" className="flex items-center justify-between p-4 bg-orange-50/50 text-orange-800 rounded-xl hover:bg-orange-100/70 transition font-bold group hover-scale border border-orange-100/50">
                                    <span className="flex items-center gap-3">
                                        <User size={20} /> Update Profile
                                    </span>
                                     <ArrowRight size={18} className="transform group-hover:translate-x-1 transition" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
