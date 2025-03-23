import React from "react";
import styles from "./Timeline.module.css";

// Массив цветов для процессов
const colors = [
  ["#F4B0B0", "#E56A6A"],
  ["#B0DEF4", "#6A9AE5"],
  ["#F4B0E8", "#E56AD7"],
  ["#B3B0F4", "#706AE5"],
  ["#B0F4E8", "#6AE58B"],
  ["#F4D3B0", "#E5A66A"],
];

const Timeline = ({ processes }) => {
  // Функция для преобразования времени в секунды
  const timeToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Находим минимальное и максимальное время для нормализации
  const minTime = Math.min(...processes.map((p) => timeToSeconds(p.startTime)));
  const maxTime = Math.max(...processes.map((p) => timeToSeconds(p.endTime)));

  // Функция для вычисления позиции в процентах
  const getPosition = (time) => {
    const seconds = timeToSeconds(time);
    return ((seconds - minTime) / (maxTime - minTime)) * 100;
  };

  // Генерация временной шкалы
  const generateTimeScale = () => {
    const scaleLabels = [];
    const totalSeconds = maxTime - minTime;
    const step = totalSeconds / 12; // Шаг для временной шкалы

    for (let i = 0; i <= totalSeconds; i += step) {
      const timeInSeconds = minTime + i;
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      scaleLabels.push(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    }

    return scaleLabels;
  };

  return (
    <div className={styles.timelineContainer}>
      {/* Временная шкала */}
      <div className={styles.timeScale}>
        {generateTimeScale().map((time, index) => {
          const position = getPosition(time); // Позиция без масштабирования
          return (
            <div
              key={index}
              className={styles.timeLabel}
              style={{ left: `${position}%` }}>
              {time}
            </div>
          );
        })}
      </div>

      {/* Контейнер для процессов */}
      <div className={styles.processesContainer}>
        {/* Процессы */}
        {processes.map((process, index) => {
          const startPosition = getPosition(process.startTime);
          const endPosition = getPosition(process.endTime);
          const width = endPosition - startPosition;

          // Случайный выбор цвета из массива
          const [backgroundColor, borderColor] = colors[index % colors.length];

          return (
            <div key={index} className={styles.process}>
              <div
                className={styles.processLine}
                style={{
                  backgroundColor, // Цвет фона
                  border: `2px solid ${borderColor}`, // Цвет границы
                  left: `${startPosition}%`, // Позиция без масштабирования
                  width: `${width}%`, // Ширина без масштабирования
                }}>
                <div
                  className={styles.processLabel}
                  style={{
                    color: borderColor,
                  }}>
                  {process.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* Вертикальные линии в области процессов */}
        {generateTimeScale().map((time, index) => {
          const position = getPosition(time); // Позиция без масштабирования
          return (
            <div
              key={index}
              className={styles.timeSection}
              style={{ left: `${position}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
