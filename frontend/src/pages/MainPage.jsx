import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import routes from '../routes.js';
import { setChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import AddModalWindow from '../components/modalWindows/AddModalWindow.jsx';
import RemoveModalWindow from '../components/modalWindows/RemoveModalWindow.jsx';
import EditModalWindow from '../components/modalWindows/EditModalWindow.jsx';
import ChannelsSidebar from '../components/channels/ChannelsSidebar.jsx';
import ChatContent from '../components/messages/ChatContent.jsx';
import Navbar from '../components/Navbar.jsx';

export const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [channelsRes, mes] = await Promise.all([
          axios.get(routes.channelsPath(), { headers: getAuthHeader() }),
          axios.get(routes.messagesPath(), { headers: getAuthHeader() }),
        ]);
        dispatch(setChannels(channelsRes.data));
        dispatch(setMessages(mes.data));
      } catch (error) {
        if (error.isAxiosError) {
          toast.error(t('errors.serverLoadDataError'));
        } else {
          toast.error(t('errors.networkError'));
        }
      }
    };
    fetchContent();
  }, [dispatch, t]);

  return (
    <div className="vh-100">
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="vh-100 d-flex flex-column h-100">
            <Navbar />
            <div className="flex-grow-1 container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <ChannelsSidebar />
                <ChatContent />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <AddModalWindow />
      <RemoveModalWindow />
      <EditModalWindow />
    </div>
  );
};

export default MainPage;