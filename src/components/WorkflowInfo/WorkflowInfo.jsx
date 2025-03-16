import React from "react";
import "./WorkflowInfo.css";

export default function WorkflowInfo({ name, status, workflowId, runId }) {
  return (
    <div className="workflow-info">
      <div className="workflow-header">
        <div className="workflow-name">{name}</div>
        <div className="workflow-status">{status}</div>
      </div>
      <div className="workflow-details">
        <div className="workflow-id">
          <span className="workflow-id-title">Workflow ID:</span>
          <span className="workflow-id-desc">{workflowId}</span>
        </div>
        <div className="workflow-id">
          <span className="workflow-id-title">Run ID:</span>
          <span className="workflow-id-desc">{runId}</span>
        </div>
      </div>
    </div>
  );
}
