import "./editingPage.scss";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const EditingPage = () => {
    const { id } = useParams()
    return (
        <div className="editing-page">
            <h2>Select Action</h2>
            <div className="editing-buttons">
                <Link to={`/newQuiz/${id}`} className="slider-arrow">
                    ✏️ Edit Test
                </Link>
                <Link to={`/editQuestions/${id}`} className="slider-arrow">
                    ❓ Edit Questions
                </Link>
                <a href="/" className="slider-arrow delete-btn">
                    🗑️ Delete Test
                </a>
            </div>
        </div>

    );
};

export default EditingPage;
