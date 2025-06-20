import { useDispatch } from "react-redux";
import { setChannel, deleteChannel, renameChannel, setCurrentChannel} from '../slices/channelsSlice.js';
import { setMessage } from '../slices/messagesSlice.js';

const notify = (text) => toast(text);
const dispatch = useDispatch();
const defaultChannel = { id: '1', name: 'general', removable: false }

const socketFunction = (socket) => {
    if (!socket) return;
    
    socket.on('newMessage', (newMessage) => {
      dispatch(setMessage(newMessage));
    });

    socket.on('newChannel', (newChannel) => {
      dispatch(setChannel(newChannel))
      dispatch(setCurrentChannel(newChannel))
      notify("Канал создан")
    });

    socket.on('removeChannel', (deletedChannelId) => {
      dispatch(deleteChannel(deletedChannelId))
      dispatch(setCurrentChannel(defaultChannel))
      notify("Канал удалён")
    });

    socket.on('renameChannel', (renamedChannel) => {
      dispatch(renameChannel(renamedChannel))
      dispatch(setCurrentChannel(renamedChannel))
      notify("Канал переименован")
    })

    return () => {
      socket.off('newMessage', );
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
}

export default socketFunction;