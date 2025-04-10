// const API_BASE_URL = "http://localhost:8080";

export const checkProxyConnection = async () => {
  try {
    const response = await fetch(`/process/info`, {
      method: "HEAD",
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchWorkflow = async () => {
  const response = await fetch(`/process/info`);
  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }
  return await response.json();
};

// Получить XML-диаграму
export const fetchProcessDiagram = async (processName) => {
  const response = await fetch(`/process/${processName}/diagram`);
  if (!response.ok) {
    throw new Error("Failed to fetch diagram");
  }
  return await response.text();
};

// Получить instance процесса
export const fetchProcessInstances = async (processName) => {
  const response = await fetch(`/process/${processName}/instance`);
  if (!response.ok) {
    throw new Error("Failed to fetch process instances");
  }
  return await response.json();
};

// Получить instance процесса по ID
export const fetchProcessInstancesById = async (processName, instanceId) => {
  const response = await fetch(
    `/process/${processName}/instance/${instanceId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch process instances by ID");
  }
  return await response.json();
};

// Получить актуальную информацию о тасках для instance
export const fetchTasks = async (processName, instanceId) => {
  const response = await fetch(
    `/process/${processName}/instance/${instanceId}/task`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks history");
  }
  return await response.json();
};

// Получить историю тасок для instance
export const fetchTaskHistory = async (processName, instanceId) => {
  const response = await fetch(
    `/process/${processName}/instance/${instanceId}/task/history`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch task history");
  }
  return await response.json();
};

// Получить историю таски по Id для instance
export const fetchTaskHistoryById = async (processName, instanceId, taskId) => {
  const response = await fetch(
    `/process/${processName}/instance/${instanceId}/task/history/${taskId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch task by ID history");
  }
  return await response.json();
};
