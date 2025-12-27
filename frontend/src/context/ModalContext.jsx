import { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState('login'); // 'login', 'register', 'forgot-password'

    const openModal = (view = 'login') => {
        setModalView(view);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, modalView, openModal, closeModal, setModalView }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);

export default ModalContext;
