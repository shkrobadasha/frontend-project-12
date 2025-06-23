import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setChannel, deleteChannel, renameChannel } from '../slices/channelsSlice.js'
import { setMessage } from '../slices/messagesSlice.js'

const Socket = ({ children }) => {
  const socket = io()
  const dispatch = useDispatch()
  const notify = text => toast(text)
    
  socket.on('newMessage', newMessage => {
    dispatch(setMessage(newMessage))
  })

  socket.on('newChannel', newChannel => {
    dispatch(setChannel(newChannel))
    notify('Канал создан')
  })

  socket.on('removeChannel', deletedChannelId => {
    dispatch(deleteChannel(deletedChannelId))
    notify('Канал удалён')
  })

  socket.on('renameChannel', renamedChannel => {
    dispatch(renameChannel(renamedChannel))
    notify('Канал переименован')
  })

  return children
}

export default Socket