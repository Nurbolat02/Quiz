import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QuizService from '../../shared/quiz/QuizContext'
import Footer from '../../footer/Footer';
import Spinner from '../../spinner/Spinner';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import useQuizSlider from '../../../hooks/useQuizSlider';
import ResultModal from '../resultModal/ResultModal';
import Timer from '../../timer/Timer';
import './questions.scss';

const Questions = () => {
    const { id } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [modalResult, setModalResult] = useState({});
    const [isRunning, setIsRunning] = useState(true);
    const [answers, setAnswers] = useState({});
    const { getQuestionsById } = QuizService();

    const timerRef = useRef();

    const handleAnswer = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmitTest = (e) => {
        e.preventDefault();
        setIsRunning(false);

        let score = 0;
        quizData.questions.forEach(q => {
            if (answers[q.id] === q.correct) {
                score++;
            }
        });

        const totalSeconds = timerRef.current.getSeconds();
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const formatted = `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;

        const obj = {
            questions: quizData.questions.length,
            correct: score,
            testId: id,
            modal: true,
            time: formatted
        };
        setModalResult(obj);
    };

    useEffect(() => {
        getDataFromServer(id);
    }, []);

    const getDataFromServer = (id) => {
        setLoading(true);
        getQuestionsById(id)
            .then(data => {
                setQuizData(data);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => setLoading(false));
    };

    const renderDataToLayout = (data) => (
        <div className="quiz-track">
            {data.questions.map(element => (
                <div className="quiz-slide" key={element.id}>
                    <h3 className="quiz-question__title">{element.question}</h3>
                    {element.options.map((option, index) => (
                        <label className="quiz-option" key={index}>
                            <input
                                type="radio"
                                name={`q-${element.id}`}
                                value={index}
                                checked={answers[element.id] === index}
                                onChange={() => handleAnswer(element.id, index)}
                            />
                            <span className="quiz-option__letter">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="quiz-option__text">{option}</span>
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );

    useQuizSlider(!loading && !error && quizData?.questions?.length > 0);

    const loadBlock = loading ? <Spinner /> : quizData ? renderDataToLayout(quizData) : null;
    const errorBlock = error ? <ErrorMessage /> : null;

    return (
        <div className="wrapper">
            <div className="test__info">
                <div className="quiz__name">{quizData?.description}</div>
                <Timer ref={timerRef} isRunning={isRunning} />
            </div>
            <div className="test">
                <ul className="test__header carousel-indicators"></ul>
                <div className="test__content">
                    <div className="quiz-slider">
                        <form className="quiz-form" onSubmit={handleSubmitTest}>
                            {loadBlock}
                            {errorBlock}
                        </form>
                    </div>
                </div>
                <div className="test__footer">
                    <div className="slider-controls">
                        <button type="button" className="slider-arrow prev">← Prev</button>
                        <button
                            onClick={(event) => handleSubmitTest(event)}
                            className="slider-submit"
                            type="submit"
                        >
                            Submit Test
                        </button>
                        <button type="button" className="slider-arrow next">Next →</button>
                    </div>
                </div>
            </div>
            <Footer />
            {modalResult.modal && <ResultModal data={modalResult} />}
        </div>
    );
};

export default Questions;
