// store/DataStore.js
import {
    checkProxyConnection,
    fetchProcessDiagram,
    fetchProcessInstances,
    fetchTaskHistoryById,
    fetchTasks,
    fetchWorkflow
} from "../../api/api.js";
import {Workflow} from "../../models/Workflow.js";
import {Instance} from "../../models/Instance.js";
import {Task} from "../../models/Task.js";

export class DataStore {
    constructor() {
        this.workflows = []; // Все загруженные workflows
        this.currentWorkflow = null; // Текущий выбранный workflow
        this.updateInterval = null; // Ссылка на интервал обновления
        this.subscribers = new Set();
    }

    // Метод для подписки на изменения
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Метод для уведомления подписчиков
    notifySubscribers() {
        this.subscribers.forEach(callback => callback());
    }

    // Инициализация хранилища
    async init() {
        // Проверяем соединение с сервером
        const isConnected = await checkProxyConnection();
        if (!isConnected) {
            throw new Error("Не удалось подключиться к серверу");
        }

        // Загружаем workflow (диаграмму и базовую информацию)
        await this.loadAllWorkflows();
    }

    // Добавляем метод для загрузки всех workflow
    async loadAllWorkflows() {
        try {
            const workflowsData = await fetchWorkflow();
            this.workflows = workflowsData.map(wf =>
                new Workflow(wf.processName, wf.id, null) // Пока без XML
            );
            this.notifySubscribers();
            // return this.workflows;
        } catch (error) {
            console.error("Ошибка загрузки списка workflow:", error);
            throw error;
        }
    }

    // Загрузка workflow (статичных данных)
    async loadWorkflow(workflow) {
        // Останавливаем предыдущее обновление, если было
        this.stopAutoUpdate();

        try {
            // 1. Получаем диаграмму процесса
            workflow.diagramXml = await fetchProcessDiagram(workflow.name);

            // 2. Обновляем хранилище
            this.currentWorkflow = workflow;

            // 4. Загружаем актуальные данные экземпляров
            await this.updateInstances(workflow.name);
        } catch (error) {
            console.error("Ошибка загрузки workflow:", error);
            throw error;
        }

        // Запускаем периодическое обновление
        this.startAutoUpdate(workflow.name);
    }

    // Обновление данных экземпляров и задач
    async updateInstances(processName) {
        if (!this.currentWorkflow) return;

        try {
            // 1. Получаем экземпляры процесса
            const instancesData = await fetchProcessInstances(processName);

            // 2. Обновляем данные для каждого экземпляра
            await Promise.all(
                instancesData.map(async (instanceData) => {
                    let instance = this.currentWorkflow.instances.find(
                        (inst) => inst.id === instanceData.id
                    );

                    // Создаем новый экземпляр если не найден
                    if (!instance) {
                        instance = new Instance(
                            instanceData.id,
                            instanceData.startedAt,
                            isNaN(instanceData.completedAt) ? null : instanceData.completedAt,
                            instanceData.businessData || {}
                        );
                        this.currentWorkflow.addInstance(instance);
                    } else {
                        // Обновляем существующий экземпляр
                        instance.startTime = instance._parseUnixTimeWithNanos(instanceData.startedAt);
                        instance.endTime = isNaN(instanceData.completedAt) ? null : instance._parseUnixTimeWithNanos(instanceData.completedAt);
                        instance.businessData = instanceData.businessData || {};
                    }

                    // 3. Обновляем задачи для экземпляра
                    await this.updateTasksForInstance(processName, instance.id);

                    this.notifySubscribers(); // Уведомляем подписчиков
                })
            );

            // Удаляем экземпляры, которых больше нет на сервере
            this.currentWorkflow.instances = this.currentWorkflow.instances.filter(
                (inst) => instancesData.some((data) => data.id === inst.id)
            );

            this.lastUpdate = new Date();
            return true;
        } catch (error) {
            console.error("Ошибка обновления экземпляров:", error);
            return false;
        }
    }

    // Обновление задач для конкретного экземпляра
    async updateTasksForInstance(processName, instanceId) {
        const instance = this.currentWorkflow?.instances.find(
            (inst) => inst.id === instanceId
        );
        if (!instance) return;

        try {
            // Получаем актуальные задачи
            const activeTasks = await fetchTasks(processName, instanceId);

            // Обновляем задачи в экземпляре
            instance.tasks = activeTasks
                .map((taskData) => {
                    return new Task(
                        taskData.id,
                        taskData.bpmnElementId,
                        taskData.taskName,
                        taskData.status,
                        taskData.startTime,
                        taskData.endTime
                    );
                })
                .sort((a, b) => {
                    return a.startTime - b.startTime;
                });
        } catch (error) {
            console.error(
                `Ошибка обновления задач для экземпляра ${instanceId}:`,
                error
            );
        }
    }

    // Запуск автоматического обновления
    startAutoUpdate(processName, interval = 2000) {
        this.stopAutoUpdate();
        this.updateInterval = setInterval(async () => {
            await this.updateInstances(processName);
        }, interval);
    }

    // Остановка автоматического обновления
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Получение экземпляра по ID
    getInstanceById(id) {
        if (!this.currentWorkflow) return null;
        return this.currentWorkflow.instances.find((inst) => inst.id === id);
    }

    // Метод для получения только активных задач экземпляра
    getTasksForInstance(instanceId) {
        const instance = this.getInstanceById(instanceId);
        return instance?.tasks || [];
    }

    getHistoryByTaskId(instanceId, taskId) {
        if (!this.currentWorkflow) return null;
        return fetchTaskHistoryById(this.currentWorkflow.name, instanceId, taskId);
    }

    setBaseUrl(serverUrl) {
        this.baseUrl = serverUrl;
    }

    checkConnection() {
        if (this.baseUrl !== "http://localhost:8080") {
            throw new Error("Unable to connect");
        }
        return true;
    }
}

export const dataStore = new DataStore();
