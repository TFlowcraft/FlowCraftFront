import React, {useState, useEffect} from "react";
import styles from "./Timeline.module.css";
import {dataStore} from "../../../resources/data/dataStore";

const colors = [
    ["#F4B0B0", "#E56A6A"],
    ["#B0DEF4", "#6A9AE5"],
    ["#F4B0E8", "#E56AD7"],
    ["#B3B0F4", "#706AE5"],
    ["#B0F4E8", "#53B56E"],
    ["#F4D3B0", "#E5A66A"],
];

const Timeline = ({selectedProcess}) => {
    const [tasks, setTasks] = useState([]);
    const [timeScale, setTimeScale] = useState([]);
    const [containerWidth, setContainerWidth] = useState(0);

    const timelineRef = React.useRef(null);

    useEffect(() => {
        if (!selectedProcess) return;

        const updateTasks = () => {
            const instance = dataStore.getInstanceById(selectedProcess.id);
            const sortedTasks = (instance?.tasks || []).sort((a, b) =>
                a.startTime - b.startTime
            );
            setTasks(sortedTasks);
            updateTimeScale(sortedTasks);
        };

        const updateTimeScale = (tasks) => {
            if (tasks.length === 0) return;

            const minTime = tasks[0].startTime.valueOf();
            const maxTime = Math.max(
                ...tasks.map(t => t.endTime?.valueOf() || minTime + 10000),
                tasks[tasks.length - 1].startTime.valueOf() + 1000
            );

            const totalDuration = maxTime - minTime;
            const timeScale = [];

            // Рассчитываем оптимальное количество меток (5-10 на экран)
            const targetLabelCount = Math.min(10, Math.max(5, Math.floor(containerWidth / 100)));
            const step = Math.ceil(totalDuration / targetLabelCount / 1000) * 1000;

            // Добавляем метки с учетом выбранного шага
            for (let time = minTime; time <= maxTime; time += step) {
                timeScale.push({
                    time: new Date(time),
                    position: ((time - minTime) / (maxTime - minTime)) * 100
                });
            }

            // Добавляем конечную метку
            if (timeScale.length === 0 || timeScale[timeScale.length - 1].time.valueOf() < maxTime) {
                timeScale.push({
                    time: new Date(maxTime),
                    position: 100
                });
            }

            setTimeScale(timeScale);
        };

        const handleResize = () => {
            if (timelineRef.current) {
                setContainerWidth(timelineRef.current.offsetWidth);
            }
        };

        // Инициализация ширины
        handleResize();
        window.addEventListener('resize', handleResize);

        updateTasks();
        const unsubscribe = dataStore.subscribe(updateTasks);

        return () => {
            window.removeEventListener('resize', handleResize);
            unsubscribe();
        };
    }, [selectedProcess, containerWidth]);

    if (!selectedProcess) {
        return <div className={styles.noSelection}>Please select a process first</div>;
    }

    if (tasks.length === 0) {
        return <div className={styles.noSelection}>No tasks found</div>;
    }

    const minTime = tasks[0].startTime.valueOf();
    const maxTime = timeScale.length > 0
        ? timeScale[timeScale.length - 1].time.valueOf()
        : minTime + 1000;

    const getPosition = (date) => {
        return ((date.valueOf() - minTime) / (maxTime - minTime)) * 100;
    };

    return (
        <>
            <div className={styles.processIdHeader}>
                Instance ID:
                <div className={styles.processIdHeaderData}>{selectedProcess.id}</div>
            </div>
            <div className={styles.timelineContainer} ref={timelineRef}>

                <div className={styles.timeScale}>
                    {timeScale.map((point, index) => (
                        <div
                            key={index}
                            className={styles.timeLabel}
                            style={{left: `${point.position}%`}}
                        >
                            {point.time.toLocaleTimeString("ru-RU", {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                    ))}
                </div>

                <div className={styles.processesContainer}>
                    {tasks.map((task, index) => {
                        const startPos = getPosition(task.startTime);
                        const endPos = task.endTime
                            ? getPosition(task.endTime)
                            : Math.min(100, startPos + 5); // Минимальная ширина для активных задач

                        const [bgColor, borderColor] = colors[index % colors.length];
                        const label = task.name.length > 15
                            ? `${task.name.substring(0, 12)}...`
                            : task.name;

                        return (
                            <div key={task.id} className={styles.process}>
                                <div
                                    className={styles.processLine}
                                    style={{
                                        backgroundColor: bgColor,
                                        border: `1px solid ${borderColor}`,
                                        left: `${startPos}%`,
                                        width: `${Math.max(3, endPos - startPos)}%`,
                                    }}
                                >
                                    <div className={styles.processLabel} style={{color: borderColor}}>
                                        {label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {timeScale.map((point, index) => (
                        <div
                            key={`line-${index}`}
                            className={styles.timeSection}
                            style={{left: `${point.position}%`}}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Timeline;