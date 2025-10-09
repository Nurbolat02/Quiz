import "./editingPage.scss";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const EditingPage = () => {
    const { id } = useParams()
    return (
        <div className="editing-page">
            <h2>Выберите действие</h2>
            <div className="editing-buttons">
                <Link to={`/newQuiz/${id}`} className="slider-arrow">
                    ✏️ Изменить тест
                </Link>
                <Link to={`/editQuestions/${id}`} className="slider-arrow">
                    ❓ Изменить вопросы
                </Link>
                <a href="/" className="slider-arrow delete-btn">
                    🗑️ Удалить тест
                </a>
            </div>
        </div>
    );
};

export default EditingPage;
