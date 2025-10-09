import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ isRunning }, ref) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!isRunning) return;
        const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, [isRunning]);

    // 👇 наружу пробрасываем методы
    useImperativeHandle(ref, () => ({
        getSeconds: () => seconds
    }));

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return <div className="quiz__time">{formatTime(seconds)}</div>;
});

export default Timer;
