import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuiz } from '../../../context/QuizContext'
import "./createQuestions.scss";

const CreateQuestions = () => {
    const { id } = useQuiz()
    const [questions, setQuestions] = useState([]);
    const newId = id;

    const saveQuestions = async () => {
        try {
            // 1. Получаем объект по ID
            const res = await fetch(`http://localhost:3001/quizzes/${newId}`);
            if (!res.ok) throw new Error("Тест не найден");
            const quiz = await res.json();

            // 2. Добавляем новые вопросы
            const updatedQuiz = {
                ...quiz,
                questions: quiz.questions
                    ? [
                        ...quiz.questions,
                        ...questions.map((q, index) => ({
                            id: Date.now() + index,
                            question: q.text,
                            options: q.answers,
                            correct: q.correct,
                        })),
                    ]
                    : questions.map((q, index) => ({
                        id: Date.now() + index,
                        question: q.text,
                        options: q.answers,
                        correct: q.correct,
                    })),
            };

            // 3. Отправляем обратно на сервер
            const putRes = await fetch(`http://localhost:3001/quizzes/${newId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedQuiz),
            });

            if (!putRes.ok) throw new Error("Не удалось обновить тест");
        } catch (error) {
            console.error("Ошибка при сохранении вопросов:", error);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { text: "", answers: ["", "", "", ""], correct: 0 },
        ]);
    };

    const removeQuestion = (qIndex) => {
        setQuestions(questions.filter((_, i) => i !== qIndex));
    };

    const handleQuestionChange = (qIndex, value) => {
        const updated = [...questions];
        updated[qIndex].text = value;
        setQuestions(updated);
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updated = [...questions];
        updated[qIndex].answers[aIndex] = value;
        setQuestions(updated);
    };

    const handleCorrectChange = (qIndex, correctIndex) => {
        const updated = [...questions];
        updated[qIndex].correct = correctIndex;
        setQuestions(updated);
    };

    return (
        <div className="create-questions">
            <h2>Добавление вопросов для теста {id}</h2>
            <button onClick={addQuestion} className="btn btn-add">
                ➕ Добавить вопрос
            </button>

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="question-block">
                    <div className="question-header">
                        <input
                            type="text"
                            placeholder={`Вопрос ${qIndex + 1}`}
                            value={q.text}
                            onChange={(e) =>
                                handleQuestionChange(qIndex, e.target.value)
                            }
                        />
                        <button
                            onClick={() => removeQuestion(qIndex)}
                            className="btn btn-remove"
                        >
                            ❌
                        </button>
                    </div>

                    <div className="answers">
                        {q.answers.map((ans, aIndex) => (
                            <label key={aIndex}>
                                <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={q.correct === aIndex}
                                    onChange={() =>
                                        handleCorrectChange(qIndex, aIndex)
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder={`Вариант ${aIndex + 1}`}
                                    value={ans}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            qIndex,
                                            aIndex,
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {questions.length > 0 && (
                <Link to='/' onClick={saveQuestions} className="btn btn-save">
                    💾 Сохранить все вопросы
                </Link>
            )}
        </div>
    );
};

export default CreateQuestions;
