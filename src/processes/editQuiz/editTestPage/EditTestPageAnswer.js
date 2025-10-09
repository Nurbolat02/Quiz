import './editTestPage.scss'
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import QuizService from "../../services/QuizService";

const EditTestPage = () => {
    const { id } = useParams(); // получаем id редактируемого теста из URL
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        time: "",
        description: "",
        rating: "",
        image: ""
    });
    const [categories, setCategories] = useState([]);

    const { getQuestionsById, updateTest, getCategoriesInfo } = QuizService();

    const images = [
        { label: "Книга 1", path: "/img/book_1.png" },
        { label: "Книга 2", path: "/img/book_2.png" },
        { label: "Книга 3", path: "/img/book_3.png" },
        { label: "Пусто", path: "" }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getCategoriesInfo(); // теперь это реально массив
                setCategories(cats);

                const test = await getQuestionsById(id); // если тоже async
                if (test) {
                    setFormData({
                        name: test.name || "",
                        category: test.category || cats[0]?.name || "",
                        time: test.time || "",
                        description: test.description || "",
                        rating: test.rating || "",
                        image: test.image || ""
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        updateTest(id, formData);
        console.log("Тест обновлен:", formData);
    };

    return (
        <div className="edit-test">
            <h2 className="edit-test__title">Редактировать тест</h2>
            <form className="edit-test__form" onSubmit={(e) => e.preventDefault()}>
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
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
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
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    >
                        {images.map((img, idx) => (
                            <option key={idx} value={img.path}>
                                {img.label}
                            </option>
                        ))}
                    </select>
                </label>

                <Link
                    to={`/editQuestions/${id}`}
                    className="btn btn-save"
                    onClick={handleSave}
                >
                    Далее → Вопросы
                </Link>
            </form>
        </div>
    );
};

export default EditTestPage;
