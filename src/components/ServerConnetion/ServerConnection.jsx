import React, { useState } from 'react';
import { dataStore } from '../../resources/data/dataStore';
import './ServerConnection.css';

const ServerConnection = ({ onConnectionSuccess }) => {
    const [serverUrl, setServerUrl] = useState('http://localhost:8080');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    const handleTryConnection = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            // Сохраняем URL в dataStore или конфиге
            dataStore.setBaseUrl(serverUrl);

            // Проверяем соединение
            const isConnected = await dataStore.checkConnection();

            if (isConnected) {
                onConnectionSuccess();
            } else {
                setError('Failed to connect to server');
            }
        } catch (err) {
            setError(err.message || 'Connection error');
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <section>
            <div className="server-connection-container">
                <h2>Connect to Workflow Server</h2>
                <div className="connection-form">
                    <input
                        type="text"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        placeholder="Enter server URL (e.g. http://localhost:8080)"
                    />
                    <button
                        onClick={handleTryConnection}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : 'Try Connection'}
                    </button>
                </div>
                {error && <div className="connection-error">{error}</div>}
            </div>
        </section>
    );
};

export default ServerConnection;