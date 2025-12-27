import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

import Footer from './Footer';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useContext(AuthContext);

    return (
        <div className="flex min-h-screen font-sans antialiased relative">
            {user && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isCollapsed={isCollapsed}
                    toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            )}
            <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 relative ${user ? (isCollapsed ? 'lg:ml-20' : 'lg:ml-64') : ''}`}>
                <Navbar
                    onMenuClick={user ? () => setIsSidebarOpen(!isSidebarOpen) : undefined}
                    isCollapsed={isCollapsed}
                    isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-8 overflow-y-auto mt-20">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
