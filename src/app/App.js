import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/mainPage/MainPage";
import Questions from "../widgets/questions/Questions";
import CreateQuestions from "../processes/createQuestions/CreateQuestions";
import CreateTest from "../processes/createTest/CreateTest";
import EditingPage from '../processes/editQuiz/editingPage/EditingPage'
import CreatePizda from '../processes/createQuestions/CreatePizda'
import { QuizProvider } from "../shared/quiz/QuizContext";
const App = () => {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/quiz/:id" element={<Questions />} />
        <Route path="/newQuiz/:id?" element={<CreateTest />} />ы
        <Route path="/editPage/:id" element={<EditingPage />} />
        <Route path="/editQuestions/:id" element={<CreateQuestions />} />
        {/* <Route path="/editQuestions/:id" element={<CreatePizda />} /> */}
      </Routes>
    </QuizProvider>
  )
};

export default App;
