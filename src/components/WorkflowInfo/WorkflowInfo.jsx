import React from "react";
import styles from "./WorkflowInfo.module.css";

export default function WorkflowInfo({ name, status, workflowId }) {
  const getStatusClassName = (status) => {
    switch(status) {
      case 'Completed':
        return styles.workflowStatusCompleted;
      case 'In work':
        return styles.workflowStatusInWork;
      default:
        return styles.workflowStatus;
    }
  };

  return (
      <section className={styles.workflowInfo}>
        <div className={styles.workflowHeader}>
          <div className={styles.workflowName}>{name}</div>
          <div className={getStatusClassName(status)}>{status}</div>
        </div>
        <div className={styles.workflowDetails}>
          <div className={styles.workflowId}>
            <span className={styles.workflowIdTitle}>Workflow ID:</span>
            <span className={styles.workflowIdDesc}>{workflowId}</span>
          </div>
        </div>
      </section>
  );
}