import React, { useState, useEffect } from "react";
import styles from "./ProcessInstances.module.css"; // Импортируем стили из модуля

const fetchHeader = () => {
  return ["State", "ID", "Start time", "Business Key"];
};

// Функция, которая возвращает текущие данные
const fetchData = () => {
  return [
    ["OK", "fdghe_64hbf_8f9h8_nkjedfj", "12:03:45 09-03-2025", ""],
    ["OK", "fdghe_64hbf_8f9h8_nkjedfj", "12:03:57 09-03-2025", ""],
    ["OK", "fdghe_64hbf_8f9h8_nkjedfj", "12:04:21 09-03-2025", ""],
  ];
};

const ProcessInstances = () => {
  const [data, setData] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const newData = fetchData(); // Получаем данные
    setData(newData); // Обновляем состояние
  }, []);

  return (
    <div className={styles.table}>
      {/* Заголовки таблицы */}
      <div className={styles.tableHeader}>
        {fetchHeader().map((item, index) => (
          <div key={index} className={styles.headerCell}>
            {item}
          </div>
        ))}
      </div>

      {/* Данные таблицы */}
      <div className={styles.tableBody}>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.tableRow}>
            <div className={`${styles.tableCell} ${styles.stateCell}`}>
              {row[0]}
            </div>
            <div className={`${styles.tableCell} ${styles.idCell}`}>
              {row[1]}
            </div>
            <div className={`${styles.tableCell} ${styles.startTimeCell}`}>
              {row[2]}
            </div>
            <div className={`${styles.tableCell} ${styles.businessKeyCell}`}>
              {row[3]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessInstances;
