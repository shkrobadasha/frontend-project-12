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
import { useSelector } from 'react-redux';


const PrivateRoute = ({ children }) => {
  const isAuth = useSelector(state => state.auth.loggedIn)
  const location = useLocation();
  return (
    isAuth ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
     return (
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
     )
}

export default App;
