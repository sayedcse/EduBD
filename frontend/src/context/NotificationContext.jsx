import { createContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // Auto hide after 3 seconds
    }, []);

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
            {/* Render Toast with LiquidGlass Effect */}
            {notification && (
                <div className="fixed bottom-12 left-0 w-full flex justify-center z-50 animate-fade-in-up pointer-events-none">
                    <div className={`glass-toast flex items-center gap-3 px-6 py-3 min-w-[300px] justify-between pointer-events-auto ${notification.type === 'success' ? 'glass-toast-success' :
                        notification.type === 'error' ? 'glass-toast-error' :
                            'glass-toast-info'
                        }`}>
                        <div className={`flex items-center gap-3 justify-between w-full font-medium ${notification.type === 'success' ? 'text-green-800' :
                            notification.type === 'error' ? 'text-red-700' :
                                'text-primary-dark'
                            }`}>
                            <div className="flex items-center gap-3 flex-1 justify-center">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${notification.type === 'success' ? 'bg-green-600' :
                                    notification.type === 'error' ? 'bg-red-600' :
                                        'bg-blue-500'
                                    }`}></div>
                                <span className="text-sm text-center">{notification.message}</span>
                            </div>
                            <button onClick={hideNotification} className="text-current opacity-60 hover:opacity-100 transition rounded-full p-1 hover:bg-black/5 ml-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
