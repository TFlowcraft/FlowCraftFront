import React, { useState } from "react";
import styles from "./Tabs.module.css";

export default function Tabs({ children, selectedProcess }) {
  const [activeTab, setActiveTab] = useState("Process Instances");

  const tabs = children.map((child) => ({
    label: child.props.label,
    disabled: child.props.label !== "Process Instances" && !selectedProcess,
    content: child,
  }));

  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content;

  return (
      <section>
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            {tabs.map((tab) => (
                <button
                    key={tab.label}
                    className={`${styles.tabButton} ${
                        activeTab === tab.label ? styles.active : ""
                    } ${tab.disabled ? styles.disabled : ""}`}
                    onClick={() => !tab.disabled && setActiveTab(tab.label)}
                    disabled={tab.disabled}
                >
                  {tab.label}
                </button>
            ))}
          </div>
          <div className={styles.tabsContent}>
            {activeContent}
          </div>
        </div>
      </section>
  );
}