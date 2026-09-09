const express = require("express");
const cors = require("cors");
const { eq, asc } = require("drizzle-orm");
const db = require("./db");
const { categories, images, quizzes, questions } = require("./schema");

const app = express();
app.use(cors());
app.use(express.json());

const serializeQuiz = (quiz) => ({
    id: quiz.id,
    category: quiz.category,
    name: quiz.name,
    time: quiz.time,
    rating: quiz.rating,
    image: quiz.image,
    description: quiz.description,
    questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct: q.correct,
    })),
});

const findQuiz = (id) =>
    db.query.quizzes.findFirst({
        where: eq(quizzes.id, id),
        with: { questions: { orderBy: asc(questions.position) } },
    });

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/categories", async (req, res, next) => {
    try {
        res.json(await db.select().from(categories));
    } catch (error) {
        next(error);
    }
});

app.get("/images", async (req, res, next) => {
    try {
        res.json(await db.select().from(images));
    } catch (error) {
        next(error);
    }
});

app.get("/quizzes", async (req, res, next) => {
    try {
        const rows = await db.query.quizzes.findMany({
            with: { questions: { orderBy: asc(questions.position) } },
        });
        res.json(rows.map(serializeQuiz));
    } catch (error) {
        next(error);
    }
});

app.get("/quizzes/:id", async (req, res, next) => {
    try {
        const quiz = await findQuiz(req.params.id);
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });
        res.json(serializeQuiz(quiz));
    } catch (error) {
        next(error);
    }
});

app.post("/quizzes", async (req, res, next) => {
    try {
        const { id, category, name, time, rating, image, description } = req.body;
        await db.insert(quizzes).values({ id, category, name, time, rating, image, description });
        res.status(201).json(serializeQuiz(await findQuiz(id)));
    } catch (error) {
        next(error);
    }
});

app.put("/quizzes/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category, name, time, rating, image, description, questions: newQuestions } = req.body;

        await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(quizzes).where(eq(quizzes.id, id));
            if (!existing) return;

            await tx.update(quizzes).set({
                category: category ?? existing.category,
                name: name ?? existing.name,
                time: time ?? existing.time,
                rating: rating ?? existing.rating,
                image: image ?? existing.image,
                description: description ?? existing.description,
            }).where(eq(quizzes.id, id));

            if (Array.isArray(newQuestions)) {
                await tx.delete(questions).where(eq(questions.quizId, id));
                if (newQuestions.length > 0) {
                    await tx.insert(questions).values(
                        newQuestions.map((q, index) => ({
                            id: q.id,
                            quizId: id,
                            position: index,
                            question: q.question,
                            options: q.options,
                            correct: q.correct,
                        }))
                    );
                }
            }
        });

        const quiz = await findQuiz(id);
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });
        res.json(serializeQuiz(quiz));
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Quiz API listening on port ${PORT}`);
});
