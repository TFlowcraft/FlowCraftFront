import React, { useEffect, useRef } from "react";
import BpmnNavigatedViewer from "bpmn-js/lib/NavigatedViewer";
import TokenSimulationModule from "bpmn-js-token-simulation/lib/viewer";
import "./DiagramViewer.css";

const BpmnViewer = ({ diagram }) => {
  const bpmnViewerRef = useRef(null);

  useEffect(() => {
    const bpmnViewer = new BpmnNavigatedViewer({
      container: bpmnViewerRef.current,
      additionalModules: [TokenSimulationModule],
    });

    async function renderDiagram() {
      try {
        await bpmnViewer.importXML(diagram);
        // Масштабируем диаграмму по размеру контейнера
        bpmnViewer.get("canvas").zoom("fit-viewport");
        // Запускаем симуляцию
        // bpmnViewer.get("canvas").start();
      } catch (err) {
        console.error("Ошибка при отображении диаграммы:", err);
      }
    }

    renderDiagram();

    return () => {
      bpmnViewer.destroy();
    };
  }, [diagram]);

  return (
    <section>
      <div ref={bpmnViewerRef} className="bpmn-container" />
    </section>
  );
};

export default BpmnViewer;
