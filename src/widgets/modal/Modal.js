import './modal.scss';
import { QuizContext } from '../../shared/quiz/QuizContext';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { useContext, useState, useEffect, useCallback } from 'react';
import QuizService from '../../shared/services/QuizService';
import { Link } from 'react-router-dom';

const Modal = () => {
    const { getQuizzeById } = QuizService()
    const { modalOpen, setModalOpen, currentQuiz, currentData, setCurrentData, update } = useContext(QuizContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const getData = useCallback(() => {
        getQuizzeById(currentQuiz)
            .then(setCurrentData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [currentQuiz, getQuizzeById, setCurrentData]);
    useEffect(() => {
        if (!currentQuiz) return;
        getData()
    }, [currentQuiz, update, getData])
    const rendeData = ({ id, name, questionsCount, time, rating, description }) => {
        return (
            <div className="modal" id="quizModal">
                <div onClick={() => { setModalOpen(false) }} className="modal__overlay"></div>
                <div key={id} className="modal__content">
                    <button onClick={() => { setModalOpen(false) }} className="modal__close">×</button>
                    <div className="modal__header">
                        <div className="quiz__info info__text">
                            <div className="quiz__name">{name}</div>
                            <div className="quiz__qws gray">{questionsCount} Question</div>
                            <div className="quiz__time gray">{time} min</div>
                        </div>
                        <div className="quiz__rating">
                            <i className="fa-solid fa-star"></i>
                            {rating}
                        </div>
                    </div>
                    <div className="modal__body">
                        <p>{description}</p>
                    </div>
                    <div className="modal__footer">
                        <Link onClick={() => { setModalOpen(false) }} to={`/editPage/${currentQuiz}`} className="btn btn-start">edit</Link>
                        <Link onClick={() => { setModalOpen(false) }} to={`/quiz/${currentQuiz}`} className="btn btn-start">start</Link>
                    </div>
                </div>
            </div>
        )

    }
    const spinerBlock = loading && modalOpen ? <Spinner /> : null;
    const errorBlock = error && modalOpen ? <ErrorMessage /> : null;
    const contentBlock = (currentData && (!error && !loading && modalOpen)) ? rendeData(currentData) : null;
    return (
        <>
            {spinerBlock}
            {errorBlock}
            {contentBlock}
        </>
    )
};

export default Modal;
