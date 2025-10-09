import Header from '../../widgets/header/Header'
import Footer from '../../widgets/footer/Footer'
import Modal from '../../widgets/modal/Modal'
import Filter from '../../features/filter/Filter'
import QuizItem from '../../widgets/quizItem/QuizItem'
import './mainPage.scss'

const MainPage = () => {
    return (
        <div className="wrapper">
            <Header />
            <main className="main">
                <div className="container">
                    <div className="main__content">
                        <div className="main__head" />
                        <Filter />
                        <QuizItem />
                    </div>
                </div>
            </main>
            <Footer />
            <Modal />
        </div>
    )
}
export default MainPage;
