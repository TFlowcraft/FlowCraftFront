import React, { useState, useEffect } from "react";
import "./MainLayout.css";
import BpmnViewer from "../../components/DiagramViewer/DiagramViewer";
import WorkflowInfo from "../../components/WorkflowInfo/WorkflowInfo";
import Tabs from "../../components/Tabs/Tabs";
import ProcessInstances from "../../components/Tabs/TabComponents/ProcessInstances";
import History from "../../components/Tabs/TabComponents/History";
import Timeline from "../../components/Tabs/TabComponents/Timeline";

export default function MainLayout() {
  const [diagram, setDiagram] = useState(null);

  // Загружаем диаграмму при монтировании компонента
  useEffect(() => {
    // Загружаем содержимое файла из папки public
    fetch("./diagram.bpmn")
      .then((response) => response.text())
      .then((data) => {
        setDiagram(data); // Устанавливаем содержимое диаграммы
      })
      .catch((error) => {
        console.error("Ошибка при загрузке диаграммы:", error);
      });
  }, []);

  const processes = [
    {
      label: "Process 1",
      startTime: "14:30:00",
      endTime: "15:45:00",
    },
    {
      label: "Process 2",
      startTime: "15:00:00",
      endTime: "16:30:00",
    },
    {
      label: "Process 3",
      startTime: "16:00:00",
      endTime: "17:15:00",
    },
    {
      label: "Process 4",
      startTime: "12:30:00",
      endTime: "20:45:00",
    },
    {
      label: "Process 5",
      startTime: "15:00:00",
      endTime: "16:30:00",
    },
    {
      label: "Process 6",
      startTime: "16:00:00",
      endTime: "19:15:00",
    },
  ];

  return (
    <main>
      <WorkflowInfo
        name={"ExampleWorkflow"}
        status={"Running"}
        workflowId={"sdgj4_jidjs_32h32_838nb"}
        runId={"fdghe_64hbf_8f9h8_nkjsdfj"}
      />

      {/* Отображаем диаграмму, если она загружена */}
      {<BpmnViewer diagram={diagram} />}

      <Tabs>
        <div label="Process Instances">
          <ProcessInstances />
        </div>
        <div label="History">
          <History />
        </div>
        <div label="Timeline">
          <Timeline processes={processes} />
        </div>
      </Tabs>
    </main>
  );
}
