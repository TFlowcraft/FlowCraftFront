import React, { useState, useCallback } from "react";
import "./MainLayout.css";
import BpmnViewer from "../../components/DiagramViewer/DiagramViewer";
import WorkflowInfo from "../../components/WorkflowInfo/WorkflowInfo";

export default function MainLayout() {
  const [diagram, setDiagram] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Обработчик загрузки файла через input
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      readFile(file);
    }
  };

  // Обработчик drag and drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && (file.type === "text/xml" || file.name.endsWith(".bpmn"))) {
      readFile(file);
    }
  }, []);

  // Обработчик drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Обработчик drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Чтение файла
  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setDiagram(content);
    };
    reader.readAsText(file);
  };

  return (
    <main>
      <WorkflowInfo
        name={"ExampleWorkflow"}
        status={"Running"}
        workflowId={"sdgj4_jidjs_32h32_838nb"}
        runId={"fdghe_64hbf_8f9h8_nkjsdfj"}
      />
      {diagram ? (
        <BpmnViewer diagram={diagram} />
      ) : (
        <div
          className={`drop-area ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("file-input").click()}>
          <span className="plus-icon">+</span>
          <p>Перетащите файл сюда или нажмите, чтобы загрузить</p>
          <input
            id="file-input"
            type="file"
            accept=".bpmn,.xml"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
      )}
    </main>
  );
}
