const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const QUIZ_SELECT = `
    SELECT
        q.id, q.category, q.name, q.time, q.rating, q.image, q.description,
        COALESCE(
            (SELECT json_agg(
                json_build_object('id', qs.id, 'question', qs.question, 'options', qs.options, 'correct', qs.correct)
                ORDER BY qs.position
            ) FROM questions qs WHERE qs.quiz_id = q.id),
            '[]'
        ) AS questions
    FROM quizzes q
`;

app.get("/", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/categories", async (req, res, next) => {
    try {
        const { rows } = await pool.query("SELECT id, name FROM categories ORDER BY id");
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

app.get("/images", async (req, res, next) => {
    try {
        const { rows } = await pool.query("SELECT id, label, path FROM images ORDER BY id");
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

app.get("/quizzes", async (req, res, next) => {
    try {
        const { rows } = await pool.query(`${QUIZ_SELECT} ORDER BY q.id`);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

app.get("/quizzes/:id", async (req, res, next) => {
    try {
        const { rows } = await pool.query(`${QUIZ_SELECT} WHERE q.id = $1`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Quiz not found" });
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
});

app.post("/quizzes", async (req, res, next) => {
    try {
        const { id, category, name, time, rating, image, description } = req.body;
        await pool.query(
            `INSERT INTO quizzes (id, category, name, time, rating, image, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, category, name, time, rating, image, description]
        );
        const { rows } = await pool.query(`${QUIZ_SELECT} WHERE q.id = $1`, [id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        next(error);
    }
});

app.put("/quizzes/:id", async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { category, name, time, rating, image, description, questions } = req.body;

        await client.query("BEGIN");

        await client.query(
            `UPDATE quizzes
             SET category = COALESCE($1, category),
                 name = COALESCE($2, name),
                 time = COALESCE($3, time),
                 rating = COALESCE($4, rating),
                 image = COALESCE($5, image),
                 description = COALESCE($6, description)
             WHERE id = $7`,
            [category, name, time, rating, image, description, id]
        );

        if (Array.isArray(questions)) {
            await client.query("DELETE FROM questions WHERE quiz_id = $1", [id]);
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                await client.query(
                    `INSERT INTO questions (id, quiz_id, position, question, options, correct)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [q.id, id, i, q.question, JSON.stringify(q.options), q.correct]
                );
            }
        }

        await client.query("COMMIT");

        const { rows } = await pool.query(`${QUIZ_SELECT} WHERE q.id = $1`, [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Quiz not found" });
        res.json(rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        next(error);
    } finally {
        client.release();
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
