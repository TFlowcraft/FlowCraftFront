import React, { useState } from "react";
import styles from "./Tabs.module.css"; // Импортируем стили из модуля

export default function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState("Timeline"); // Состояние для активной вкладки

  // Находим содержимое активной вкладки
  const activeContent = children.find(
    (child) => child.props.label === activeTab
  );

  return (
    <section>
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          {children.map((child) => (
            <button
              key={child.props.label}
              className={`${styles.tabButton} ${
                activeTab === child.props.label ? styles.active : ""
              }`}
              onClick={() => setActiveTab(child.props.label)}>
              {child.props.label}
            </button>
          ))}
        </div>
        <div className={styles.tabsContent}>{activeContent}</div>
      </div>
    </section>
  );
}
