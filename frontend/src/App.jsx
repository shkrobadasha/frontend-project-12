import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import MainPage from './pages/MainPage.jsx' ;
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => {
     return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element = {<NotFoundPage/>}/>
          <Route path="/" element = {<MainPage />}/>
          <Route path="login" element = {< LoginPage />}/>
        </Routes>
      </BrowserRouter>
     )
}

export default App;
