import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setChannel, deleteChannel, renameChannel} from '../slices/channelsSlice.js';
import { setMessage } from '../slices/messagesSlice.js';



const Socket = ({ children }) => {
    //const defaultChannel = { id: '1', name: 'general', removable: false }
    const socket = io();
    const dispatch = useDispatch();
    const notify = (text) => toast(text);
    
    socket.on('newMessage', (newMessage) => {
      dispatch(setMessage(newMessage));
    });
//тут добавляем в хранилище новый канал
    socket.on('newChannel', (newChannel) => {
      dispatch(setChannel(newChannel))
      //dispatch(setCurrentChannel(newChannel))
      notify("Канал создан")
    });

    socket.on('removeChannel', (deletedChannelId) => {
      dispatch(deleteChannel(deletedChannelId))
     // dispatch(setCurrentChannel(defaultChannel))
      notify("Канал удалён")
    });

    socket.on('renameChannel', (renamedChannel) => {
      dispatch(renameChannel(renamedChannel))
      //dispatch(setCurrentChannel(renamedChannel))
      notify("Канал переименован")
    })

    /*return () => {
      socket.off('newMessage', );
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };*/

    return children;
};

export default Socket;
