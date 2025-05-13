import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
//import { Button, Navbar, Nav } from 'react-bootstrap';
import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.jsx' ;
import NotFoundPage from './pages/NotFoundPage.jsx';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';


const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
     return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element = {<NotFoundPage/>}/>
            <Route path="/login" element = {< LoginPage />}/>
            <Route path="/" element = {(
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>)}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
     )
}

export default App;
