import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    return (
        <header className="h-20 glass-panel m-4 flex items-center justify-between px-4 md:px-8 sticky top-4 z-40 backdrop-blur-xl transition-all">
            {/* Mobile Menu Toggle */}
            <button 
                onClick={onMenuClick}
                className="lg:hidden p-2 mr-2 text-primary hover:bg-white/20 rounded-lg transition"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar (Placeholder) */}
            <div className="flex-1 max-w-lg relative group mr-4">
                <input 
                    type="text" 
                    placeholder="Search courses, students..." 
                    className="w-full bg-white/40 border border-white/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-white/60 transition-all shadow-inner"
                />
                <svg className="w-5 h-5 text-primary/50 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
               <button className="p-3 text-primary/60 hover:text-secondary transition rounded-full hover:bg-white/40 shadow-sm hover:shadow-md active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
               </button>
               <button className="p-3 text-primary/60 hover:text-secondary transition rounded-full hover:bg-white/40 shadow-sm hover:shadow-md active:scale-95">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               </button>
            </div>
        </header>
    );
};

export default Header;
