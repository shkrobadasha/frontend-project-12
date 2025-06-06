
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLeave = () => {
        navigate('/login');
        localStorage.removeItem('userId');
    }

    return (
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" >
            <div class="container">
                <a class="navbar-brand" href="/">My Chat</a>
                <button type='button' class="btn btn-primary" onClick={handleLeave}>Выйти</button>
            </div>
        </nav>
    )
};

export default Navbar;
