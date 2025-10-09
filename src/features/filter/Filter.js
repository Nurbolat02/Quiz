import QuizService from '../../shared/services/QuizService';
import Spinner from '../../widgets/spinner/Spinner';
import { QuizContext } from '../../shared/quiz/QuizContext';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import './filter.scss';

const Filter = () => {
    const [data, setData] = useState([]);
    const { getCategories } = QuizService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    const { activeCategory, setActiveCategory } = useContext(QuizContext)
    useEffect(() => {
        getData()
    }, [])
    const getData = () => {
        setLoading(true);
        getCategories()
            .then(setData)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }

    const rendeData = () => {
        return data.map(({ id, name }) => {
            const isActive = name === activeCategory;
            return (
                <li
                    key={id}
                    onClick={() => setActiveCategory(name)}
                    className={`main__categori ${isActive ? 'active' : ''}`}
                    data-categori={name}
                >
                    {name}
                </li>
            );
        });
    };
    const spinerBlock = loading ? <Spinner size={100} /> : null;
    const contentBlock = (data && (!error && !loading)) ? rendeData(data) : null;
    return (
        <ul className="main__categories info__text">
            {spinerBlock}
            {contentBlock}
        </ul>

    );
};

export default Filter;
