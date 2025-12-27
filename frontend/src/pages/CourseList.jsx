import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { Clock, Tag, User, ArrowRight, PlusCircle, BookOpen } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('lms/courses/');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="container mx-auto p-6 animate-fade-in-up">
                {/* ... existing content ... */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pt-24">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                            <BookOpen className="text-accent-warm" /> Available Courses
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">Expand your knowledge with our expert-led courses</p>
                    </div>

                    {(user?.role === 'instructor' || user?.role === 'admin') && (
                        <Link
                            to="/courses/new"
                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent-warm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:-translate-y-1"
                        >
                            <PlusCircle size={20} /> Create New Course
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <div key={course.id} className={`glass-card rounded-2xl overflow-hidden flex flex-col hover-scale group animate-fade-in-up delay-${index * 100 % 500} min-w-[300px]`}>
                                    <div className="h-48 relative overflow-hidden">
                                        {/* Placeholder for course image - random gradient for now */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-secondary opacity-90 group-hover:scale-110 transition-transform duration-700"></div>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/30 shadow-sm">
                                                {course.category_detail?.name || 'General'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-xl font-bold text-primary-dark group-hover:text-primary transition-colors line-clamp-2">{course.title}</h2>
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-lg border border-green-200">
                                                ${course.price}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} className="text-secondary" />
                                                    <span>{course.instructor_detail?.username}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} className="text-accent-warm" />
                                                    <span>{course.duration || 'Flexible'}</span>
                                                </div>
                                            </div>

                                            <Link
                                                to={`/courses/${course.id}`}
                                                className="block w-full text-center bg-white/50 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 border border-white/60 hover:border-transparent group-hover:shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm"
                                            >
                                                View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 glass-panel rounded-3xl">
                                <div className="bg-white/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <BookOpen size={48} className="text-primary/40" />
                                </div>
                                <h3 className="text-2xl font-bold text-primary-dark mb-2">No courses available yet</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">Check back later for new content or create a course if you are an instructor.</p>
                                {(user?.role === 'instructor' || user?.role === 'admin') && (
                                    <Link to="/courses/new" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-accent-warm transition shadow-lg hover:-translate-y-1">
                                        <PlusCircle size={20} /> Get Started
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageTransition>
    );

};

export default CourseList;
