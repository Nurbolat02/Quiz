import { useState } from "react";
import { Link } from "react-router-dom";
// import QuizService from "../../../services/QuizService";
import "./createTest.scss";
// import { useQuiz } from "../../../context/QuizContext";
import { v4 as uuidv4 } from "uuid";

const CreateTest = () => {
    // const { changeId } = useQuiz();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        time: "",
        description: "",
        rating: "",
        image: "", // теперь путь к картинке внутри формы
    });

    // const { addNewTest } = QuizService();

    // Предзагруженные пути к картинкам с подписью
    const images = [
        { label: "Книга 1", path: "/img/book_1.png" },
        { label: "Книга 2", path: "/img/book_2.png" },
        { label: "Книга 3", path: "/img/book_3.png" },
        { label: "Пусто", path: "" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        const newTestId = uuidv4();
        // changeId(newTestId);

        const newObj = { ...formData, id: newTestId };
        setFormData(newObj);

        // addNewTest(newObj);

        console.log("Новый тест:", newObj);
    };

    return (
        <div className="create-test">
            <h2 className="create-test__title">Создать новый тест</h2>
            <form className="create-test__form" onSubmit={(e) => e.preventDefault()}>
                <label>
                    Название:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Категория:
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Время (мин):
                    <input
                        type="number"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </label>

                <label>
                    Рейтинг (1–5):
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        required
                    />
                </label>

                <label>
                    Описание:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Выберите изображение:
                    <select
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    >
                        {images.map((img, idx) => (
                            <option key={idx} value={img.path}>
                                {img.label}
                            </option>
                        ))}
                    </select>
                </label>

                <Link
                    to={`/createTest/questions`}
                    className="btn btn-save"
                    onClick={handleNext}
                >
                    Далее → Вопросы
                </Link>
            </form>
        </div>
    );
};

export default CreateTest;
