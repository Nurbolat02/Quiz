import './header.scss'
import { useState, useEffect, useRef } from 'react';
import { QuizContext } from '../../shared/quiz/QuizContext';
import { useContext } from 'react';
import Search from '../../features/search/Search';
import { Link } from 'react-router-dom';

const Header = () => {
    const { modalOpen } = useContext(QuizContext)
    const [burgerOpen, setBurgerOpen] = useState(false);

    const menuRef = useRef(null);
    const burgerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !menuRef.current.contains(event.target) &&
                !burgerRef.current.contains(event.target)
            ) {
                setBurgerOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="container">
                <div className="header__salute padding">
                    <div
                        ref={burgerRef}
                        onClick={() => { setBurgerOpen(!burgerOpen) }}
                        className={`menu ${burgerOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="avatar">
                        <img src="/img/avatar.png" alt="User Avatar" className="avatar__img" />
                    </div>
                </div>

                <div className="header__userName">Hello, James</div>

                <Search />
            </div>

            <nav
                ref={menuRef}
                className={`side-menu ${modalOpen ? '' : burgerOpen ? 'open' : ''}`}>
                <button onClick={() => { setBurgerOpen(false) }} className="side-menu__close">×</button>
                <ul>
                    <Link to={`/newQuiz`} >➕ Add a test</Link>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
