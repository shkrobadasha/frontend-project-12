import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import rollbarConfig from './rollbar.js';
import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.jsx' ;
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';



const PrivateRoute = ({ children }) => {
  const isAuth = JSON.parse(localStorage.getItem('userId'))
  const location = useLocation();
  return (
    isAuth ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
     return (
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="*" element = {<NotFoundPage/>}/>
              <Route path="/login" element = {< LoginPage />}/>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/" element = {(
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>)}/>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </Provider>
     )
}

export default App;
