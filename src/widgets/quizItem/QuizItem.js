import './quizItem.scss';
import { useState, useEffect, useCallback } from 'react';
import QuizService from '../../shared/services/QuizService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { QuizContext } from '../../shared/quiz/QuizContext';
import { useContext } from 'react';


const QuizItem = () => {
    const [data, setData] = useState([]);
    const { getAllQuizzes } = QuizService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { setModalOpen, setCurrentQuiz, activeCategory, value } = useContext(QuizContext)
    const getData = useCallback(() => {
        setLoading(true);
        getAllQuizzes()
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [getAllQuizzes]);
    useEffect(() => {
        const timer = setTimeout(() => {
            getData()
        }, 1000)

        return () => clearTimeout(timer);
    }, [getData])

    const rendeData = (data) => {
        return data
            .filter(item => (activeCategory === 'all' || item.category === activeCategory))
            .filter(item => (item.name.indexOf(value) > -1))
            .map(({ id, category, name, questionsCount, time, rating, image, description, questions }) => (
                <li onClick={() => {
                    setModalOpen(true);
                    setCurrentQuiz(id)
                }} key={id} className="main__quiz" data-category={category}>
                    <div className="quiz__img">
                        <img src={image} alt={name} className="quiz__avatar" />
                    </div>
                    <div className="quiz__info info__text">
                        <div className="quiz__name">{name}</div>
                        <div className="quiz__qws yellow">{questionsCount} questions</div>
                        <div className="quiz__time yellow">{time} min</div>
                    </div>
                    <div className="quiz__rating">
                        <i className="fa-solid fa-star"></i>
                        {rating}
                    </div>
                </li>
            ));
    };
    const spinerBlock = loading ? <Spinner /> : null;
    const errorBlock = error ? <ErrorMessage /> : null;
    const contentBlock = (data && (!error && !loading)) ? rendeData(data) : null;
    return (
        <ul className="main__quizes">
            {spinerBlock}
            {errorBlock}
            {contentBlock}
        </ul>
    );
};

export default QuizItem;
