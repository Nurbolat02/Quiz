const fs = require("fs");
const path = require("path");
const db = require("./db");
const { categories, images, quizzes, questions } = require("./schema");

async function run() {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "db.json"), "utf8"));

    for (const category of data.categories || []) {
        await db.insert(categories).values(category)
            .onConflictDoUpdate({ target: categories.id, set: { name: category.name } });
    }

    for (const image of data.images || []) {
        await db.insert(images).values(image)
            .onConflictDoUpdate({ target: images.id, set: { label: image.label, path: image.path } });
    }

    for (const quiz of data.quizzes || []) {
        const { questions: quizQuestions, questionsCount, ...quizFields } = quiz;
        await db.insert(quizzes).values(quizFields)
            .onConflictDoUpdate({ target: quizzes.id, set: quizFields });

        for (let i = 0; i < (quizQuestions || []).length; i++) {
            const q = quizQuestions[i];
            const row = { id: q.id, quizId: quiz.id, position: i, question: q.question, options: q.options, correct: q.correct };
            await db.insert(questions).values(row)
                .onConflictDoUpdate({ target: questions.id, set: row });
        }
    }

    console.log("Migration complete.");
    process.exit(0);
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
