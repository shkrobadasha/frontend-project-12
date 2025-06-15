
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLeave = () => {
        navigate('/login');
        localStorage.removeItem('userId');
        //localStorage.clear();
    };
//нужно чтобы при запуске показывался начальный экран в любом случае
//проверить что там с токеном
 
    return (
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" >
            <div class="container">
                <a class="navbar-brand" href="/">{t("navbarTitle")}</a>
                <button type='button' class="btn btn-primary" onClick={handleLeave}>{t("exitButton")}</button>
            </div>
        </nav>
    )
};

export default Navbar;
