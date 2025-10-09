import { useState, useContext, useEffect } from "react";
import "./createQuestions.scss";
import { useParams, Link } from "react-router-dom";
import QuizService from "../../shared/services/QuizService";
import { QuizContext } from "../../shared/quiz/QuizContext";

const CreatePizda = () => {
    const { id } = useParams();
    const { update, setUpdate } = useContext(QuizContext);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const { getQuizzeById, updateQuizze } = QuizService();

    // Загружаем тест с сервера
    const fetchQuiz = async () => {
        const fetchedQuiz = await getQuizzeById(id);
        setQuiz(fetchedQuiz);

        if (fetchedQuiz.questions && fetchedQuiz.questions.length > 0) {
            setQuestions(fetchedQuiz.questions);
        }
    };

    useEffect(() => {
        fetchQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Сохранение всех вопросов
    const saveQuestions = async () => {
        if (!quiz) return;

        const updatedQuiz = {
            ...quiz,
            questions: questions.map((q, index) => ({
                ...q,
                id: q.id || Date.now() + index
            }))
        };

        setQuiz(updatedQuiz);
        await updateQuizze(id, updatedQuiz);
        setUpdate(!update);
    };

    // Добавить новый вопрос
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                correct: 0
            }
        ]);
    };

    // Удалить вопрос
    const removeQuestion = (qIndex) => {
        setQuestions(questions.filter((_, i) => i !== qIndex));
    };

    // Изменение текста вопроса
    const handleQuestionChange = (qIndex, value) => {
        const updated = [...questions];
        updated[qIndex].question = value;
        setQuestions(updated);
    };

    // Изменение текста варианта ответа
    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[aIndex] = value;
        setQuestions(updated);
    };

    // Изменение правильного ответа
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
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        />
                        <button
                            className="btn btn-remove"
                            onClick={() => removeQuestion(qIndex)}
                        >
                            ❌
                        </button>
                    </div>

                    <div className="answers">
                        {q.options.map((ans, aIndex) => (
                            <label key={aIndex}>
                                <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={q.correct === aIndex}
                                    onChange={() => handleCorrectChange(qIndex, aIndex)}
                                />
                                <input
                                    type="text"
                                    placeholder={`Вариант ${aIndex + 1}`}
                                    value={ans}
                                    onChange={(e) =>
                                        handleAnswerChange(qIndex, aIndex, e.target.value)
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            {questions.length > 0 && (
                <Link to="/" onClick={saveQuestions} className="btn btn-save">
                    💾 Сохранить все вопросы
                </Link>
            )}
        </div>
    );
};

export default CreatePizda;
