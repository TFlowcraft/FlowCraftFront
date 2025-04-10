import React, { useState, useEffect } from "react";
import styles from "./History.module.css";
import { dataStore } from "../../../resources/data/dataStore";

const getStatusStyles = (status) => {
    switch(status) {
        case 'COMPLETED':
            return {
                color: '#488400',
                backgroundColor: '#d5ffa2'
            };
        case 'RUNNING':
            return {
                color: '#FFB600',
                backgroundColor: '#FFE49F'
            };
        case 'PENDING':
            return {
                color: '#1D65FF',
                backgroundColor: '#9FBDFF'
            };
        default:
            return {};
    }
};

const TaskHistoryItem = ({ historyItem }) => {
    return (
        <>
            <div className={styles.historyItem}>
                <div className={styles.historyStatus}>
                    Status:
                    <span style={getStatusStyles(historyItem.taskStatus)}>
                        {historyItem.taskStatus}
                    </span>
                </div>
                <div className={styles.historyTimestamp}>
                    Time: <span>{new Date(historyItem.timestamp * 1000).toLocaleString()}</span>
                </div>
                {historyItem.errorStacktrace && Object.keys(historyItem.errorStacktrace).length > 0 && (
                    <div className={styles.historyError}>
                        Error: <pre>{JSON.stringify(historyItem.errorStacktrace, null, 2)}</pre>
                    </div>
                )}
            </div>
        </>
    );
};

const History = ({ selectedProcess }) => {
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [taskHistory, setTaskHistory] = useState({});
    const [loadingHistory, setLoadingHistory] = useState({});

    useEffect(() => {
        if (!selectedProcess) return;

        const updateTasks = () => {
            const instance = dataStore.getInstanceById(selectedProcess.id);
            setTasks(instance?.tasks || []);
        };

        updateTasks();
        const unsubscribe = dataStore.subscribe(updateTasks);

        return () => unsubscribe();
    }, [selectedProcess]);

    const toggleTaskHistory = async (taskId) => {
        if (expandedTaskId === taskId) {
            setExpandedTaskId(null);
            return;
        }

        setLoadingHistory(prev => ({ ...prev, [taskId]: true }));

        try {
            const history = await dataStore.getHistoryByTaskId(selectedProcess.id, taskId);
            setTaskHistory(prev => ({ ...prev, [taskId]: history }));
            setExpandedTaskId(taskId);
        } catch (error) {
            console.error("Error fetching task history:", error);
        } finally {
            setLoadingHistory(prev => ({ ...prev, [taskId]: false }));
        }
    };

    return (
        <>
            <div className={styles.processIdHeader}>
                Instance ID:
                <div className={styles.processIdHeaderData}>{selectedProcess.id}</div>
            </div>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    {["Status", "Task ID", "Name", "Start time", "End Time"].map((item, index) => (
                        <div key={index} className={styles.headerCell}>
                            {item}
                        </div>
                    ))}
                </div>
                <div className={styles.tableBody}>
                    {tasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <div
                                className={styles.tableRow}
                                onClick={() => toggleTaskHistory(task.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className={`${styles.tableCell} ${styles.stateCell}`}>
                                    <span style={getStatusStyles(task.status)}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className={`${styles.tableCell} ${styles.idCell}`}>
                                    {task.bpmnId}
                                </div>
                                <div className={`${styles.tableCell} ${styles.nameCell}`}>
                                    {task.name}
                                </div>
                                <div className={`${styles.tableCell} ${styles.startTimeCell}`}>
                                    {new Date(task.startTime).toLocaleString()}
                                </div>
                                <div className={`${styles.tableCell} ${styles.endTimeCell}`}>
                                    {task.endTime ? new Date(task.endTime).toLocaleString() : "-"}
                                </div>
                            </div>

                            {expandedTaskId === task.id && (
                                <div className={styles.historyContainer}>
                                    {loadingHistory[task.id] ? (
                                        <div className={styles.loading}>Loading history...</div>
                                    ) : (
                                        taskHistory[task.id]?.map((historyItem, index) => (
                                            <TaskHistoryItem key={index} historyItem={historyItem} />
                                        ))
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default History;