import React, {useState, useEffect} from "react";
import styles from "./ProcessInstances.module.css";
import {dataStore} from "../../../resources/data/dataStore";
import Modal from "../../Modal/Modal";

const ProcessInstances = ({onSelectProcess, selectedProcess}) => {
    const [instances, setInstances] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentInstance, setCurrentInstance] = useState(null);
    const [copied, setCopied] = useState(false);


    useEffect(() => {
        const updateData = () => {
            setInstances(dataStore.currentWorkflow?.instances || []);
        };

        updateData();
        const unsubscribe = dataStore.subscribe(updateData);
        return () => unsubscribe();
    }, []);

    const handleRowClick = (instance) => {
        onSelectProcess(instance);
    };

    const handleBusinessDataClick = (e, instance) => {
        e.stopPropagation();
        setCurrentInstance(instance);
        setModalOpen(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(currentInstance.businessData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Функция для получения стилей статуса
    const getStatusStyles = (status) => {
        switch(status) {
            case 'COMPLETE':
                return {
                    color: '#488400',
                    backgroundColor: '#d5ffa2'
                };
            case 'RUN':
                return {
                    color: '#FFB600',
                    backgroundColor: '#FFE49F'
                };
            default:
                return {};
        }
    };


    return (
        <div className={styles.table}>
            <div className={styles.tableHeader}>
                {["State", "ID", "Start time", "End time", "Business Key"].map((item, index) => (
                    <div key={index} className={styles.headerCell}>
                        {item}
                    </div>
                ))}
            </div>
            <div className={styles.tableBody}>
                {instances.map((instance) => (
                    <div
                        key={instance.id}
                        className={`${styles.tableRow} ${
                            selectedProcess?.id === instance.id ? styles.selectedRow : ""
                        }`}
                        onClick={() => handleRowClick(instance)}
                    >
                        <div className={`${styles.tableCell} ${styles.stateCell}`}>
                            <span style={getStatusStyles(instance.status)}>
                                {instance.status}
                            </span>
                        </div>
                        <div className={`${styles.tableCell} ${styles.idCell}`}>
                            {instance.id}
                        </div>
                        <div className={`${styles.tableCell} ${styles.startTimeCell}`}>
                            {new Date(instance.startTime).toLocaleString()}
                        </div>
                        <div className={`${styles.tableCell} ${styles.endTimeCell}`}>
                            {!isNaN(instance.endTime) ? instance.endTime.toLocaleString() : "-"}
                        </div>
                        <div className={`${styles.tableCell} ${styles.businessKeyCell}`}>
                            <button
                                className={styles.businessDataButton}
                                onClick={(e) => handleBusinessDataClick(e, instance)}
                            >
                                View Data
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {currentInstance && (
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Business Data"
                >
                    <div className={styles.dataContainerHeader}>
                        Instance ID:
                        <div className={styles.processIdHeader}>{currentInstance.id}</div>
                    </div>
                    <div className={styles.dataContainer}>
                        <div className={styles.dataHeader}>
                            {copied && <span className={styles.copyNotification}>Copied!</span>}
                            <button
                                className={styles.copyButton}
                                onClick={copyToClipboard}
                                title="Copy to clipboard"
                            >
                                Copy
                            </button>
                        </div>
                        <pre className={styles.dataContent}>
                            {JSON.stringify(currentInstance.businessData, null, 2)}
                        </pre>
                    </div>
                </Modal>
            )}


        </div>
    );
};

export default ProcessInstances;