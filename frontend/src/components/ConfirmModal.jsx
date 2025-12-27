import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        className="backdrop-blur-[20px] bg-white/0 p-6 rounded-[20px] w-full max-w-sm relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/10 border-t-white/20 overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.0))"
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-primary/50 hover:text-primary transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-accent-warm/10 text-accent-warm'}`}>
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-extrabold text-primary-dark mb-2">{title}</h3>
                            <p className="text-primary-dark font-medium mb-6 leading-relaxed">
                                {message}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-primary/70 hover:text-primary bg-white/40 hover:bg-white/60 transition-colors border border-white/20"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all transform active:scale-95 ${isDestructive
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                        : 'bg-accent-warm hover:bg-orange-600 shadow-orange-200'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
