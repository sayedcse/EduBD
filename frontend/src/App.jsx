import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ModalProvider, useModal } from './context/ModalContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import CourseForm from './pages/CourseForm';
import CourseDetails from './pages/CourseDetails';

import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UserList from './pages/UserList';

import Layout from './components/Layout';
import AuthModal from './components/AuthModal';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const { openModal } = useModal();
    const location = useLocation();

    if (loading) return <div className="p-10 text-center text-primary font-bold">Loading EduBD...</div>;

    if (!user) {
        // Redirect to home and open login modal
        openModal('login');
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
};

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AuthRedirect = ({ view }) => {
    const { openModal } = useModal();
    const { user } = useContext(AuthContext);

    // Use an effect to open module because we can't update state during render
    useEffect(() => {
        if (!user) {
            openModal(view);
        }
    }, [view, openModal, user]);

    return <Navigate to="/" replace />;
};

const AnimatedRoutes = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const Content = () => (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<AuthRedirect view="login" />} />
                <Route path="/register" element={<AuthRedirect view="register" />} />
                <Route path="/forgot-password" element={<AuthRedirect view="forgot-password" />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetails />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UserList />
                    </ProtectedRoute>
                } />
                <Route path="/courses/new" element={
                    <ProtectedRoute>
                        <CourseForm />
                    </ProtectedRoute>
                } />
                <Route path="/courses/:id/edit" element={
                    <ProtectedRoute>
                        <CourseForm />
                    </ProtectedRoute>
                } />
            </Routes>
        </AnimatePresence>
    );

    return <Layout><Content /></Layout>;
};

function App() {
    return (

        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <ModalProvider>
                        <AuthModal />
                        <AnimatedRoutes />
                    </ModalProvider>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
