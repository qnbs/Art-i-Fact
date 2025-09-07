import { useState, useEffect } from 'react';

export const useDynamicLoadingMessage = (messages: string[], interval = 2500, isActive = false) => {
    const [message, setMessage] = useState(messages[0] || '');

    useEffect(() => {
        if (!isActive || messages.length === 0) {
            if (messages.length > 0) setMessage(messages[0]);
            return;
        };

        let index = 0;
        const timer = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, interval);

        return () => clearInterval(timer);
    }, [isActive, messages, interval]);

    return message;
};
