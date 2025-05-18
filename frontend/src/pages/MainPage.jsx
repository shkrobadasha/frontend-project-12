import { Link,Outlet } from 'react-router-dom';''
import React, { useEffect, useState } from 'react';
import routes from '../routes.js';
import axios from 'axios';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const MainPage  = () => {
    /*const [content, setContent] = useState('');
     useEffect(() => {
    const fetchContent = async () => {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        setContent(data);
        };

        fetchContent();
    }, []);*/
    return(
        <div>
            <Link to ='/login'>LoginPage</Link>
            <Outlet />
        </div>
        
    )
};

export default MainPage;
