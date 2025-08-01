// ConfigContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from './Config';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        fetch(BASE_URL + '/api/configurations')
            .then((res) => {
                console.log('Raw response:', res);
                return res.json();
            })
            .then((data) => {
                console.log('Parsed JSON:', data);

                const configMap = data.configurations.reduce((acc, cfg) => {
                    acc[cfg.key] = cfg.value;
                    return acc;
                }, {});

                console.log('Transformed configMap:', configMap);
                setConfig(configMap);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, []);


    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    return useContext(ConfigContext);
}
