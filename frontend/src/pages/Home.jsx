import { Link } from 'react-router-dom';
import { useContext } from 'react';

import CourseList from './CourseList';
import PageTransition from '../components/PageTransition';
import AuthContext from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import Dashboard from './Dashboard';
const Home = () => {
    const { user } = useContext(AuthContext);
    const { openModal } = useModal();

    return (
        <PageTransition>
            <div className="min-h-screen">
                {/* Conditional Rendering based on Auth */}
                {user ? (
                    <div className="container mx-auto px-6 py-8">
                        <Dashboard />
                        <div className="mt-12">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-extrabold text-primary-dark mb-4">All Courses</h2>
                                <div className="w-24 h-1 bg-accent-warm mx-auto rounded-full"></div>
                            </div>
                            <CourseList />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Hero Section */}
                        <div className="relative overflow-hidden glass-panel m-6 mt-28 text-white py-24 mb-12 border-none">
                            {/* ... existing content ... */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
                                {/* Abstract Background Shapes */}
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-accent-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                            </div>

                            <div className="container mx-auto px-6 relative z-10 text-center">
                                <div className="animate-fade-in-up">
                                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-xs font-bold tracking-wider mb-6 animate-scale-in">
                                        WELCOME TO <Link to="/" className="hover:text-accent-yellow transition-colors">EDUBD</Link>
                                    </span>
                                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                                        Master New Skills <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow to-secondary">
                                            Shape Your Future
                                        </span>
                                    </h1>
                                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                                        Access world-class courses from expert instructors. Whether you're starting a new career or advancing in your current field, <Link to="/" className="font-bold hover:text-white transition-colors">EduBD</Link> is your gateway to success.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <a href="#courses" className="bg-accent-warm hover:bg-accent-warm/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                                            Browse Courses
                                        </a>
                                        <button onClick={() => openModal('register')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-8 rounded-xl border border-white/30 hover:border-white/60 transition-all duration-300 w-full sm:w-auto">
                                            Get Started Free
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Featured Courses Section */}
                        <div id="courses" className="container mx-auto px-6 pb-20">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-extrabold text-primary-dark mb-4">Explore Our Courses</h2>
                                <div className="w-24 h-1 bg-accent-warm mx-auto rounded-full"></div>
                            </div>

                            <CourseList />
                        </div>


                    </>
                )}
            </div>
        </PageTransition>
    );
};

export default Home;
