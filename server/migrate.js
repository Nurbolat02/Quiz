const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function run() {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await pool.query(schema);

    const db = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "db.json"), "utf8"));

    for (const category of db.categories || []) {
        await pool.query(
            `INSERT INTO categories (id, name) VALUES ($1, $2)
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
            [category.id, category.name]
        );
    }

    for (const image of db.images || []) {
        await pool.query(
            `INSERT INTO images (id, label, path) VALUES ($1, $2, $3)
             ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, path = EXCLUDED.path`,
            [image.id, image.label, image.path]
        );
    }

    for (const quiz of db.quizzes || []) {
        await pool.query(
            `INSERT INTO quizzes (id, category, name, time, rating, image, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO UPDATE SET
                category = EXCLUDED.category, name = EXCLUDED.name, time = EXCLUDED.time,
                rating = EXCLUDED.rating, image = EXCLUDED.image, description = EXCLUDED.description`,
            [quiz.id, quiz.category, quiz.name, quiz.time, quiz.rating, quiz.image, quiz.description]
        );

        const questions = quiz.questions || [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await pool.query(
                `INSERT INTO questions (id, quiz_id, position, question, options, correct)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO UPDATE SET
                    quiz_id = EXCLUDED.quiz_id, position = EXCLUDED.position,
                    question = EXCLUDED.question, options = EXCLUDED.options, correct = EXCLUDED.correct`,
                [q.id, quiz.id, i, q.question, JSON.stringify(q.options), q.correct]
            );
        }
    }

    console.log("Migration complete.");
    await pool.end();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
