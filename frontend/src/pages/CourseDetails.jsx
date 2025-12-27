import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import ModalContext from '../context/ModalContext';
import { Calendar, User, Clock, Award, CheckCircle, ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { openModal } = useContext(ModalContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await api.get(`lms/courses/${id}/`);
            setCourse(response.data);
        } catch (error) {
            console.error("Failed to fetch course details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            await api.post('lms/enrollments/', { course: id });
            showNotification('Enrolled successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error("Enrollment failed", error);
            showNotification('Failed to enroll. You might already be enrolled.', 'error');
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`lms/courses/${id}/`);
            showNotification('Course deleted successfully.', 'success');
            navigate('/courses');
        } catch (error) {
            console.error("Failed to delete course", error);
            showNotification('Failed to delete course.', 'error');
        }
    };

    if (loading) return <div className="p-10 text-center text-primary font-bold">Loading Course...</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className="min-h-screen">
            <div className={`container mx-auto p-3 min-[1200px]:p-0 animate-fade-in-up ${!user ? 'pt-40' : ''}`}>
                <Link to="/courses" className="inline-flex items-center text-primary/70 hover:text-primary mb-6 transition font-medium group">
                    <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition" /> Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel p-8 rounded-2xl">
                            <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">
                                {course.category_detail?.name || 'General'}
                            </span>
                            <h1 className="text-4xl font-extrabold text-primary-dark mb-4 leading-tight">{course.title}</h1>
                            <p className="text-primary/80 text-lg leading-relaxed mb-6">{course.description}</p>

                            <div className="flex items-center gap-6 text-sm text-primary/60 font-medium py-4 border-t border-white/30">
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-white/20 rounded-full"><User size={14} /></span>
                                    Instructor: <span className="text-primary font-bold">{course.instructor_detail?.username || course.instructor_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-white/20 rounded-full"><Calendar size={14} /></span>
                                    Last updated: <span className="text-primary/80">{new Date(course.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Content / Curriculum Placeholder */}
                        <div className="glass-panel p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                                <BookOpen size={24} className="text-accent-warm" /> What you'll learn
                            </h2>
                            <ul className="space-y-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[20px] text-green-500">
                                            <Award size={18} />
                                        </div>
                                        <span className="text-primary/70">Comprehensive understanding of key concepts and practical applications in real-world scenarios.</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Card */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl overflow-hidden sticky top-28 animate-fade-in-up delay-200">
                            <div className="h-48 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-3xl drop-shadow-md">${course.price}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {user?.role === 'student' ? (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling || isEnrolled}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 ${isEnrolled
                                            ? 'bg-green-100 text-green-700 cursor-default shadow-none hover:translate-y-0'
                                            : 'bg-accent-warm text-white hover:bg-orange-600 hover:shadow-orange-200'
                                            }`}
                                    >
                                        {isEnrolled ? "Enrolled" : (enrolling ? "Enrolling..." : "Enroll Now")}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => !user && openModal('login')}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 ${user
                                            ? 'bg-gray-100 text-gray-500 cursor-default hover:translate-y-0 shadow-none'
                                            : 'bg-accent-warm text-white hover:bg-orange-600'
                                            }`}
                                        disabled={!!user} // Disable if logged in but not student (e.g. instructor)
                                    >
                                        {user ? `Logged in as ${user.role}` : 'Login to Enroll'}
                                    </button>
                                )}

                                <div className="space-y-4 pt-4 border-t border-white/30">
                                    <h3 className="font-bold text-primary-dark">This course includes:</h3>
                                    <div className="space-y-3 text-sm text-primary/70">
                                        <p className="flex items-center gap-3">
                                            <Clock size={16} className="text-secondary" />
                                            {course.duration || 'Self-paced'} duration
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <Award size={16} className="text-secondary" />
                                            Certificate of completion
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <Clock size={16} className="text-secondary" />
                                            Full Lifetime Access
                                        </p>
                                    </div>
                                </div>

                                {(user?.role === 'admin' || user?.id === course.instructor) && (
                                    <div className="pt-4 border-t border-white/30 flex gap-3">
                                        <Link to={`/courses/${course.id}/edit`} className="flex-1 bg-secondary text-white py-2 rounded-lg font-bold text-center text-sm hover:bg-sky-600 transition flex items-center justify-center gap-1 shadow-md">
                                            <Edit size={14} /> Edit
                                        </Link>
                                        <button onClick={handleDeleteClick} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-bold text-center text-sm hover:bg-red-200 transition flex items-center justify-center gap-1 shadow-md">
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Course?"
                message="Are you sure you want to delete this course? This action cannot be undone and all data associated with this course will be permanently removed."
                confirmText="Yes, Delete Course"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
};

export default CourseDetails;
