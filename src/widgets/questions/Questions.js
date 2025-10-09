// Questions.jsx
import './questions.scss';
import QuizSlider from '../../shared/hooks/QuizSlider';
import Footer from '../footer/Footer';
import Timer from '../../features/timer/Timer';
import { useParams } from "react-router-dom";
import QuizService from '../../shared/services/QuizService';
import React, { useState, useRef, useEffect, useCallback } from "react";

const Questions = () => {
    const { id } = useParams();
    const [stopTimer, setStopTimer] = useState(false);
    const [finalTime, setFinalTime] = useState(0);
    const [data, setData] = useState([]);
    const { getQuizzeById } = QuizService();
    const getData = useCallback(async () => {
        const responce = await getQuizzeById(id);
        setData(responce)
    }, [getQuizzeById, id])

    useState(() => {
        getData()
    }, [getData])

    const handleTimerFinish = (time) => {
        setFinalTime(time)
    }

    const handleQuizFinish = () => {
        setStopTimer(true)
    }


    return (
        <div className="wrapper">
            <div className="test__info">
                <div className="quiz__name">{data.description}</div>
                <Timer flag={stopTimer} getTime={handleTimerFinish} />
            </div>
            <div className="test">
                <div className="test__content">
                    <QuizSlider id={id} stopTime={handleQuizFinish} finalTime={finalTime} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Questions;
