import useHttp from "../hooks/http.hook";

const QuizService = () => {
    const { request } = useHttp();
    const getCategories = async () => {
        const result = await request('https://my-json-server.typicode.com/Nurbolat02/json/categories');
        return result
    }

    const getAllQuizzes = async () => {
        const result = await request('https://my-json-server.typicode.com/Nurbolat02/json/quizzes');
        return result.map(element => renderSingleQuizInfo(element))

    }
    const getQuizzeById = async (id) => {
        const result = await request(`https://my-json-server.typicode.com/Nurbolat02/json/quizzes/${id}`);
        return renderSingleQuizInfo(result)

    }
    const getImages = async (id) => {
        const result = await request(`https://my-json-server.typicode.com/Nurbolat02/json/images`);
        return result

    }

    const addNewQuizze = async (data) => {
        const result = await request(`https://my-json-server.typicode.com/Nurbolat02/json/quizzes`, 'POST', JSON.stringify(data));
        return result
    }

    const updateQuizze = async (id, data) => {
        const result = await request(`https://my-json-server.typicode.com/Nurbolat02/json/quizzes/${id}`, 'PUT', JSON.stringify(data));
        return result;
    };

    const renderSingleQuizInfo = (data) => {
        return {
            id: data.id,
            category: data.category,
            name: data.name,
            questionsCount: data.questions ? data.questions.length : 0,
            time: data.time,
            rating: data.rating,
            image: data.image,
            description: data.description,
            questions: data.questions,

        }
    }
    return {
        getCategories,
        getAllQuizzes,
        getQuizzeById,
        addNewQuizze,
        updateQuizze,
        getImages
    }
}
export default QuizService