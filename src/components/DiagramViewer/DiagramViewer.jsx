import React, { useEffect, useRef } from "react";
import BpmnNavigatedViewer from "bpmn-js/lib/NavigatedViewer"; // Используем NavigatedViewer
import TokenSimulation from "bpmn-js-token-simulation/lib/viewer";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "./DiagramViewer.css";

const DiagramViewer = ({ diagram, intances }) => {
  const bpmnViewerRef = useRef(null);
  const viewerInstance = useRef(null);

  useEffect(() => {
    if (!diagram) return;

    // Инициализация NavigatedViewer с поддержкой токен-симуляции
    viewerInstance.current = new BpmnNavigatedViewer({
      container: bpmnViewerRef.current,
      additionalModules: [TokenSimulation],
    });

    async function renderDiagram() {
      try {
        await viewerInstance.current.importXML(diagram);


        // Масштабирование
        const canvas = viewerInstance.current.get("canvas");
        canvas.zoom("fit-viewport", "auto");


      } catch (err) {
        console.error("Ошибка при отображении диаграммы:", err);
      }
    }

    renderDiagram();

    return () => {
      if (viewerInstance.current) {
        const tokenSimulation = viewerInstance.current.get(
          "tokenSimulation",
          false
        );
        if (tokenSimulation && tokenSimulation.isActive()) {
          tokenSimulation.stop();
        }
        viewerInstance.current.destroy();
      }
    };
  }, [diagram]);

  return (
    <section>
      <div ref={bpmnViewerRef} className="bpmn-container" />
    </section>
  );
};

export default DiagramViewer;
