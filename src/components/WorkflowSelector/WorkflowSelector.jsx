import React from 'react';
import './WorkflowSelector.css';

export default function WorkflowSelector({workflows, currentWorkflow, onSelect}) {
    return (
        <section>
            <div className="workflow-selector">
                <h2>Available Workflows</h2>
                <div className="workflow-grid">
                    {workflows.map(workflow => (
                        <div
                            key={workflow.id}
                            className={`workflow-card ${currentWorkflow?.id === workflow.id ? 'selected' : ''}`}
                            onClick={() => onSelect(workflow)}
                        >
                            <h3>{workflow.name}</h3>
                            <p>ID: {workflow.id}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}