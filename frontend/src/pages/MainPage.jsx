import { Link,Outlet } from 'react-router-dom';

const MainPage  = () => {
    return(
        <div>
            <p>It's main page!!!</p>
            <Link to ='/login'>LoginPage</Link>
            <Outlet />
        </div>
        
    )
};

export default MainPage;

<li>
        <Link to="/one">Page One</Link>
      </li>