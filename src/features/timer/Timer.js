// Timer.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { QuizContext } from "../../shared/quiz/QuizContext";

const Timer = ({ flag, getTime }) => {
    const { formatTime } = useContext(QuizContext);
    const timeRef = useRef(0);
    const [timeDisplay, setTimeDisplay] = useState(0);

    useEffect(() => {
        if (flag) {
            getTime(timeRef.current)
            return
        }
        const interval = setInterval(() => {
            timeRef.current += 1;
            setTimeDisplay(timeRef.current)
        }, 1000)


        return () => {
            clearInterval(interval)
        }

    }, [flag, getTime])

    return <div className="timer">{formatTime(timeDisplay)}</div>;
};

export default Timer;
