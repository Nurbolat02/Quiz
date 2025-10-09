import './editTestQuestions.scss'

const EditTestQuestions = () => {

    return (
        <div className="edit-questions">
            <h2>Редактирование вопросов теста 123</h2>

            <button className="btn btn-add">
                ➕ Добавить вопрос
            </button>

            <div className="question-block">
                <div className="question-header">
                    <input
                        type="text"
                        placeholder="Вопрос 1"
                        value="Что такое JavaScript?"
                    />
                    <button className="btn btn-remove">✖</button>
                </div>

                <div className="answers">
                    <label>
                        <input type="radio" name="correct-0" checked />
                        <input type="text" value="Язык программирования для веба" />
                    </label>
                    <label>
                        <input type="radio" name="correct-0" />
                        <input type="text" value="Язык разметки" />
                    </label>
                    <label>
                        <input type="radio" name="correct-0" />
                        <input type="text" value="База данных" />
                    </label>
                </div>
            </div>

            <div className="question-block">
                <div className="question-header">
                    <input
                        type="text"
                        placeholder="Вопрос 2"
                        value="Что такое переменная?"
                    />
                    <button className="btn btn-remove">✖</button>
                </div>

                <div className="answers">
                    <label>
                        <input type="radio" name="correct-1" checked />
                        <input type="text" value="Ячейка для хранения данных" />
                    </label>
                    <label>
                        <input type="radio" name="correct-1" />
                        <input type="text" value="Функция" />
                    </label>
                    <label>
                        <input type="radio" name="correct-1" />
                        <input type="text" value="Объект" />
                    </label>
                </div>
            </div>

            <button className="btn btn-save">
                💾 Сохранить все вопросы
            </button>
        </div>

    );
};

export default EditTestQuestions;
