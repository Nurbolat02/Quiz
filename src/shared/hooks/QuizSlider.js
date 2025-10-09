import React, { useState, useRef, useEffect, useCallback } from "react";
import ResultModal from "../../widgets/resultModal/ResultModal";
import QuizService from '../../shared/services/QuizService';
import "./styles.scss";

const QuizSlider = ({ id, stopTime, finalTime }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const { getQuizzeById } = QuizService();
    const getData = useCallback(async () => {
        const response = await getQuizzeById(id);
        setData(response);
    }, [id, getQuizzeById]);

    useEffect(() => {
        getData();
    }, []);

    const nextSlide = () => setSlideIndex(prev => prev >= data.questions.length - 1 ? 0 : prev + 1);
    const prevSlide = () => setSlideIndex(prev => prev <= 0 ? data.questions.length - 1 : prev - 1);
    const goToSlide = index => setSlideIndex(index);

    const handleAnswers = (questionId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const countScore = () => {
        if (!data?.questions) return 0;
        let score = 0;
        data.questions.forEach(q => {
            if (answers[q.id] === q.correct) score++;
        });
        return score;
    };

    const handleFinish = () => {
        const finalScore = countScore();
        setResult(finalScore); // устанавливаем результат
        setShowModal(true);   // показываем модалку после подсчёта
        stopTime();
    };

    if (!data?.questions || data.questions.length === 0) {
        return <div className="slider-empty">No data</div>;
    }

    return (
        <>
            <div className="slider">
                <div className="slider-counter">
                    <div className="slider-prev" onClick={prevSlide}>&#10094;</div>
                    <div>
                        <span id="current">{slideIndex + 1}</span>/<span id="total">{data.questions.length}</span>
                    </div>
                    <div className="slider-next" onClick={nextSlide}>&#10095;</div>
                </div>

                <div className="slider-wrapper">
                    <div
                        className="slider-inner"
                        style={{
                            display: 'flex',
                            width: `${data.questions.length * 100}%`,
                            transition: 'all 0.5s',
                            transform: `translateX(-${slideIndex * (100 / data.questions.length)}%)`
                        }}
                    >
                        {data.questions.map((q, index) => (
                            <div className="slide" key={index} style={{ width: `${100 / data.questions.length}%` }}>
                                <div className="slide-card">
                                    <h3 className="question__title">{q.question}</h3>
                                    <div className="quiz-options">
                                        {q.options.map((option, i) => (
                                            <label key={i} className="quiz-option">
                                                <input
                                                    type="radio"
                                                    name={`slide-${q.id}`}
                                                    value={i}
                                                    checked={answers[q.id] === i}
                                                    onChange={() => handleAnswers(q.id, i)}
                                                />
                                                <span className="quiz-option__letter">{String.fromCharCode(65 + i)}</span>
                                                <span className="quiz-option__text">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        onClick={handleFinish}
                        className="finish-test-btn"
                    >
                        Complete the test
                    </button>
                </div>

                <ol className="carousel-indicators">
                    {data.questions.map((_, index) => (
                        <li
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={slideIndex === index ? 'active' : ''}
                        />
                    ))}
                </ol>
            </div>

            {showModal && result !== null && (
                <ResultModal result={result} question={data.questions.length} time={finalTime} />
            )}
        </>
    );
};

export default QuizSlider;
