import './resultModal.scss';

const ResultModal = ({ result, question, time }) => {
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;

        // добавляем ведущий ноль, если число меньше 10
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    };
    return (
        <div className="result-modal" id="quizResultModal">
            <div className="result-modal__overlay">
                <h2 className="result-modal__title">Test results</h2>

                <div className="result-modal__content">
                    <span>Your result:</span>
                    <strong>{result} / {question}</strong>
                </div>

                <div className="result-modal__time">
                    ⏱ Test time: {formatTime(time)}
                </div>

                <div className="result-modal__buttons">
                    <a href="/" className="result-btn result-btn--home">Home</a>
                </div>
            </div>
        </div>

    );

};


export default ResultModal