// components/ErrorHandler/ErrorHandler.jsx
import React from "react";
import styles from "./ErrorHandler.module.css"; // Импорт стилей как модуля

const ErrorHandler = ({ errorCode, message, details, onRetry }) => {
  const getErrorTitle = (code) => {
    const codes = {
      CONNECTION_ERROR: "Ошибка соединения",
      RELOAD_ERROR: "Ошибка при загрузке",
      DEFAULT: "Произошла ошибка",
    };
    return codes[code] || codes.DEFAULT;
  };

  return (
    <div className={styles.errorHandler}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>{getErrorTitle(errorCode)}</h1>
        <div className={styles.errorCode}>Код: {errorCode}</div>
        <p className={styles.errorMessage}>{message}</p>
        {details && (
          <details className={styles.errorDetails}>
            <summary>Подробности</summary>
            <pre>{details}</pre>
          </details>
        )}
        <button className={styles.retryButton} onClick={onRetry}>
          Повторить попытку
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;
