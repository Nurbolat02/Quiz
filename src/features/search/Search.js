import { useState } from "react"
import { QuizContext } from "../../shared/quiz/QuizContext"
import { useContext } from "react"
const Search = () => {
    const { value, setValue } = useContext(QuizContext)
    const setInput = (event) => {
        setValue(event.target.value)
    }
    return (
        <div className="header__filter">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
                name="qviz"
                value={value}
                onChange={setInput}
                type="text"
                placeholder="Поиск..." />
        </div>
    )

}
export default Search