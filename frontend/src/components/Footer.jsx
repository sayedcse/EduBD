import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-white/20 py-8 mt-auto bg-white/10 backdrop-blur-md w-full">
            <div className="container mx-auto px-6 text-center text-primary/60 text-sm">
                <p>&copy; {new Date().getFullYear()} <Link to="/" className="hover:text-primary-dark transition-colors font-bold">EduBD</Link>. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
