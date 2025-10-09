import './editTestPage.scss'

const EditTestPage = () => {
    return (
        <div className="edit-test">
            <h2 className="edit-test__title">Редактировать тест</h2>
            <form className="edit-test__form">
                <label>
                    Название:
                    <input
                        type="text"
                        name="name"
                        value="Основы JavaScript"
                        required
                    />
                </label>

                <label>
                    Категория:
                    <select name="category" required>
                        <option value="Программирование" selected>Программирование</option>
                        <option value="Математика">Математика</option>
                        <option value="История">История</option>
                    </select>
                </label>

                <label>
                    Время (мин):
                    <input
                        type="number"
                        name="time"
                        value="30"
                        min="1"
                        required
                    />
                </label>

                <label>
                    Рейтинг (1–5):
                    <input
                        type="number"
                        name="rating"
                        value="4"
                        min="1"
                        max="5"
                        required
                    />
                </label>

                <label>
                    Описание:
                    <textarea name="description" required>
                        Тест проверяет базовые знания JavaScript: переменные, функции, циклы.
                    </textarea>
                </label>

                <label>
                    Выберите изображение:
                    <select name="image" required>
                        <option value="/images/js-test.png" selected>JavaScript</option>
                        <option value="/images/math-test.png">Математика</option>
                        <option value="/images/history-test.png">История</option>
                    </select>
                </label>

                <button type="submit" className="btn btn-save">
                    Сохранить
                </button>
            </form>
        </div>

    );
};

export default EditTestPage;
