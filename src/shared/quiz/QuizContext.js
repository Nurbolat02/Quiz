// QuizContext.jsx
import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [currentData, setCurrentData] = useState([]);
    const [update, setUpdate] = useState(false)
    const [value, setValue] = useState('');

    // Общая функция для форматирования времени
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <QuizContext.Provider
            value={{
                modalOpen,
                setModalOpen,
                activeCategory,
                setActiveCategory,
                currentQuiz,
                setCurrentQuiz,
                value,
                setValue,
                currentData,
                setCurrentData,
                formatTime,
                update,
                setUpdate
            }}>
            {children}
        </QuizContext.Provider>
    );
};
