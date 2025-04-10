import React, { useState, useEffect } from "react";
import "./MainLayout.css";
import BpmnViewer from "../../components/DiagramViewer/DiagramViewer";
import WorkflowInfo from "../../components/WorkflowInfo/WorkflowInfo";
import Tabs from "../../components/Tabs/Tabs";
import ProcessInstances from "../../components/Tabs/TabComponents/ProcessInstances";
import History from "../../components/Tabs/TabComponents/History";
import Timeline from "../../components/Tabs/TabComponents/Timeline";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import WorkflowSelector from "../../components/WorkflowSelector/WorkflowSelector";
import { dataStore } from "../../resources/data/dataStore";
import ServerConnection from "../../components/ServerConnetion/ServerConnection";

export default function MainLayout() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [workflowsList, setWorkflowsList] = useState([]);
    const [showWorkflowList, setShowWorkflowList] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnectionSuccess = () => {
        setIsConnected(true);
        setShowWorkflowList(true);
    };

    // Инициализация при монтировании
    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                await dataStore.init();

                setWorkflowsList([...dataStore.workflows]);
            } catch (err) {
                console.error("Ошибка инициализации:", err);
                setError({
                    code: "CONNECTION_ERROR",
                    message: "Ошибка загрузки данных",
                    details: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        initialize();

        // Подписка на изменения
        const unsubscribe = dataStore.subscribe(() => {
            setWorkflowsList([...dataStore.workflows]);
        });

        return () => {
            dataStore.stopAutoUpdate();
            unsubscribe();
        };
    }, []);

    // Обработчик выбора workflow
    const handleWorkflowSelect = async (workflow) => {
        try {
            setLoading(true);
            await dataStore.loadWorkflow(workflow);
            setShowWorkflowList(false);
        } catch (err) {
            setError({
                code: "WORKFLOW_LOAD_ERROR",
                message: "Ошибка загрузки workflow",
                details: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Обработчик возврата к списку
    const handleBackToList = () => {
        dataStore.currentWorkflow = null;
        dataStore.stopAutoUpdate();
        setSelectedProcess(null);
        setShowWorkflowList(true);
    };

    // Обработчик ошибок
    const handleErrorRetry = () => {
        setError(null);
        window.location.reload();
    };

    if (!isConnected) {
        return <ServerConnection onConnectionSuccess={handleConnectionSuccess} />;
    } else {

    }

    if (error) {
        return (
            <div className="main-layout">
                <ErrorHandler
                    errorCode={error.code}
                    message={error.message}
                    details={error.details}
                    onRetry={handleErrorRetry}
                />
            </div>
        );
    }

    if (loading) {
        return <div className="main-layout-loading"></div>;
    }

    // Если нет выбранного workflow, показываем список
    if (showWorkflowList || !dataStore.currentWorkflow) {
        return (
            <main className="main-layout">
                <ServerConnection onConnectionSuccess={handleConnectionSuccess} />
                <WorkflowSelector
                    workflows={workflowsList}
                    currentWorkflow={dataStore.currentWorkflow}
                    onSelect={handleWorkflowSelect}
                />
            </main>
        );
    }

    // Если workflow выбран, показываем его детали
    return (
        <main className="main-layout">
            <div className="workflow-header">
                <section>
                    <button
                        className="back-button"
                        onClick={handleBackToList}
                    >
                        ←
                    </button>
                </section>
                <WorkflowInfo
                    name={dataStore.currentWorkflow.name}
                    status={dataStore.currentWorkflow.getState()}
                    workflowId={dataStore.currentWorkflow.id}
                />

            </div>

            {dataStore.currentWorkflow.diagramXml && (
                <BpmnViewer
                    diagram={dataStore.currentWorkflow.diagramXml}
                    instances={dataStore.currentWorkflow.instances || []}
                />
            )}

            {dataStore.currentWorkflow.isInstancesNotNull() && (
                <Tabs selectedProcess={selectedProcess}>
                    <div label="Process Instances">
                        <ProcessInstances
                            instances={dataStore.currentWorkflow.instances || []}
                            onSelectProcess={setSelectedProcess}
                            selectedProcess={selectedProcess}
                        />
                    </div>
                    <div label="History">
                        <History
                            selectedProcess={selectedProcess}
                            instances={dataStore.currentWorkflow.instances || []}
                        />
                    </div>
                    <div label="Timeline">
                        <Timeline
                            selectedProcess={selectedProcess}
                            processes={dataStore.currentWorkflow.instances || []}
                        />
                    </div>
                </Tabs>
            )}
        </main>
    );
}