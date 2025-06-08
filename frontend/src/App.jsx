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
import SignUpPage from './pages/SignUpPage.jsx';


const PrivateRoute = ({ children }) => {
  const isAuth = useSelector(state => state.auth.loggedIn)
  const location = useLocation();
  return (
    isAuth ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = ({socket}) => {
     return (
        <BrowserRouter>
          <Routes>
            <Route path="*" element = {<NotFoundPage/>}/>
            <Route path="/login" element = {< LoginPage />}/>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element = {(
              <PrivateRoute>
                <MainPage socket ={socket}/>
              </PrivateRoute>)}/>
          </Routes>
        </BrowserRouter>
     )
}

export default App;
