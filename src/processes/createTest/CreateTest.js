import { useEffect, useState } from "react";
import "./createTest.scss";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import QuizService from "../../shared/services/QuizService";

const CreateTest = () => {
    const { id: routeId } = useParams();
    const navigate = useNavigate();

    const [id] = useState(routeId || uuidv4());
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [initialValues, setInitialValues] = useState({
        name: "",
        category: "all",
        time: "",
        description: "",
        rating: "4",
        image: "",
    });

    const { getQuizzeById, updateQuizze, addNewQuizze, getCategories, getImages } =
        QuizService();

    // Загружаем данные
    useEffect(() => {
        const loadData = async () => {
            const cats = await getCategories();
            const imgs = await getImages();
            setCategories(cats);
            setImages(imgs);

            if (routeId) {
                const quiz = await getQuizzeById(routeId);
                if (quiz) {
                    setInitialValues({
                        name: quiz.name || "",
                        category: quiz.category || "all",
                        time: quiz.time || "",
                        description: quiz.description || "",
                        rating: quiz.rating?.toString() || "4",
                        image: quiz.image || "",
                    });
                }
            }
        };
        loadData();
    }, [routeId, getCategories, getImages, getQuizzeById]);

    // Валидация Yup
    const validationSchema = Yup.object({
        name: Yup.string().required("Enter a name"),
        category: Yup.string().required("Select a category"),
        time: Yup.number()
            .required("Enter the time")
            .min(1, "Minimum 1 minute"),
        description: Yup.string().required("Enter a description"),
        rating: Yup.number()
            .required("Enter a rating")
            .min(1)
            .max(5),
        image: Yup.string().required("Select an image"),
    });


    const handleSubmit = async (values) => {
        const quizData = { ...values, id };
        if (routeId) {
            await updateQuizze(id, quizData);
        } else {
            await addNewQuizze(quizData);
        }
        navigate(`/editQuestions/${id}`);
    };

    return (
        <div className="edit-test">
            <h2 className="edit-test__title">
                {routeId ? "Edit Test" : "Create New Test"}

            </h2>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="edit-test__form">
                        <label>
                            Name:
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" className="error" />
                        </label>

                        <label>
                            Category:
                            <Field as="select" name="category">
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="error" />
                        </label>

                        <label>
                            Time (min):
                            <Field type="number" name="time" min="1" />
                            <ErrorMessage name="time" component="div" className="error" />
                        </label>

                        <label>
                            Rating (1–5):
                            <Field type="number" name="rating" min="1" max="5" />
                            <ErrorMessage name="rating" component="div" className="error" />
                        </label>

                        <label>
                            Description:
                            <Field as="textarea" name="description" />
                            <ErrorMessage name="description" component="div" className="error" />
                        </label>

                        <label>
                            Image:
                            <Field as="select" name="image">
                                {images.map((img, idx) => (
                                    <option key={idx} value={img.path}>
                                        {img.label}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="image" component="div" className="error" />
                        </label>

                        <button
                            type="submit"
                            className="btn btn-save"
                            disabled={isSubmitting}
                        >
                            💾 Save changes
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateTest;
