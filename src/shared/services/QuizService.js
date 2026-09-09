import { useCallback } from "react";
import useHttp from "../hooks/http.hook";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

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

const QuizService = () => {
    const { request } = useHttp();

    const getCategories = useCallback(async () => {
        return await request(`${API_URL}/categories`);
    }, [request]);

    const getAllQuizzes = useCallback(async () => {
        const result = await request(`${API_URL}/quizzes`);
        return result.map(renderSingleQuizInfo);
    }, [request]);

    const getQuizzeById = useCallback(async (id) => {
        const result = await request(`${API_URL}/quizzes/${id}`);
        return renderSingleQuizInfo(result);
    }, [request]);

    const getImages = useCallback(async () => {
        return await request(`${API_URL}/images`);
    }, [request]);

    const addNewQuizze = useCallback(async (data) => {
        return await request(`${API_URL}/quizzes`, 'POST', JSON.stringify(data));
    }, [request]);

    const updateQuizze = useCallback(async (id, data) => {
        return await request(`${API_URL}/quizzes/${id}`, 'PUT', JSON.stringify(data));
    }, [request]);

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
