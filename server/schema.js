const { pgTable, text, integer, numeric, jsonb, bigint } = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
});

const images = pgTable("images", {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    path: text("path").notNull(),
});

const quizzes = pgTable("quizzes", {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    name: text("name").notNull(),
    time: text("time"),
    rating: numeric("rating"),
    image: text("image"),
    description: text("description"),
});

const questions = pgTable("questions", {
    id: bigint("id", { mode: "number" }).primaryKey(),
    quizId: text("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    question: text("question").notNull(),
    options: jsonb("options").notNull(),
    correct: integer("correct").notNull(),
});

const quizzesRelations = relations(quizzes, ({ many }) => ({
    questions: many(questions),
}));

const questionsRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, { fields: [questions.quizId], references: [quizzes.id] }),
}));

module.exports = {
    categories,
    images,
    quizzes,
    questions,
    quizzesRelations,
    questionsRelations,
};
