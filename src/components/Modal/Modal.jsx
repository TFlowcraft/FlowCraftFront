import { createPortal } from 'react-dom';
import { useRef, useEffect } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children, open, onClose, title }) {
    const dialog = useRef();

    const handleClose = () => {
        dialog.current.close();
        onClose();
    };

    useEffect(() => {
        if (open) {
            dialog.current.showModal();
        } else {
            dialog.current.close();
        }
    }, [open]);

    return createPortal(
        <dialog ref={dialog} className={styles.dialog}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </dialog>,
        document.getElementById('modal')
    );
}