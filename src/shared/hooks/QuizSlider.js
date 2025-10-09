import React, { useState, useRef, useEffect, useCallback } from "react";
import ResultModal from "../../widgets/resultModal/ResultModal";
import QuizService from '../../shared/services/QuizService';
import "./styles.scss";

const QuizSlider = ({ id, stopTime, finalTime }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [data, setData] = useState([])
    const { getQuizzeById } = QuizService()
    const getData = useCallback(async () => {
        const response = await getQuizzeById(id);
        setData(response);
    }, [id, getQuizzeById]);

    useEffect(() => {
        getData()
    }, [])

    const nextSlide = () => setSlideIndex(prev => {
        if (prev >= data.questions.length - 1) {
            return 0
        }
        else {
            return prev + 1
        }
    })
    const prevSlide = () => setSlideIndex(prev => {
        if (prev <= 0) {
            return data.questions.length - 1
        }
        else {
            return prev - 1
        }
    })
    const goToSlide = (index) => {
        setSlideIndex(index)
    }

    const handleAnswers = (questionId, optionIndex) => {
        setAnswers(prev => {
            return {
                ...prev,
                [questionId]: optionIndex
            }
        })
    }

    const countScore = () => {
        let score = 0;
        data.questions.forEach(element => {
            if (answers[element.id] === element.correct) {
                score++
            }
        })
        setResult(score)
    }

    if (!data?.questions || data.questions.length === 0) {
        return <div className="slider-empty">Данных нет</div>;
    }

    return (
        <>
            {console.log(data)}
            <div className="slider">
                <div className="slider-counter">
                    <div className="slider-prev" onClick={prevSlide} >&#10094;</div>
                    <div>
                        <span id="current">{slideIndex + 1}</span>/<span id="total">{data.questions.length}</span>
                    </div>
                    <div className="slider-next" onClick={nextSlide} >&#10095;</div>
                </div>

                <div className="slider-wrapper" >
                    <div
                        className="slider-inner"
                        style={{
                            display: 'flex',
                            width: `${data.questions.length * 100}%`,
                            transition: 'all 0.5s',
                            transform: `translateX(-${slideIndex * (100 / data.questions.length)}%)`
                        }}
                    >
                        {data.questions.map((element, index) => {
                            return (
                                <div className="slide" key={index} style={{
                                    width: `${100 / data.questions.length}%`,
                                }} >
                                    <div className="slide-card">
                                        <h3 className="question__title">{element.question}</h3>
                                        <div className="quiz-options">
                                            {element.options.map((option, index) => {
                                                return (
                                                    <label key={index} className="quiz-option">
                                                        <input
                                                            type="radio"
                                                            name={`slide-${element.id}`}
                                                            value={index}
                                                            checked={answers[element.id] === index}
                                                            onChange={() => { handleAnswers(element.id, index) }}
                                                        />
                                                        <span className="quiz-option__letter">{String.fromCharCode(65 + index)}</span>
                                                        <span className="quiz-option__text">{option}</span>
                                                    </label>
                                                )
                                            })}


                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div style={{ marginTop: "20px", textAlign: "center" }}>

                    <button
                        onClick={() => {
                            countScore();
                            stopTime();
                        }}
                        className="finish-test-btn"
                    >
                        Завершить тест
                    </button>



                </div>
                <ol className="carousel-indicators">
                    {data.questions.map((_, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => { goToSlide(index) }}
                                className={`${slideIndex === index ? 'active' : ''}`}
                            />
                        )
                    })}

                </ol>
            </div>
            {result && <ResultModal result={result} question={data.questions.length} time={finalTime} />}

        </>


    );
};

export default QuizSlider;
