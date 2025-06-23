
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import * as Profanity from 'leo-profanity'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { setCurrentChannel } from '../../slices/channelsSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { setRemoveModalActive, setIdForRemove, setEditModalActive, setChannelForEdit } from '../../slices/modalSlice.js'

const RemovableChannel = ({ channelData }) => {

  const dispatch = useDispatch()
  const currentChannel = useSelector(state => state.channels.currentChannel)
  const { t } = useTranslation()

  const clickChannelHandler = (channelData) => {
    dispatch(setCurrentChannel(channelData))
  }

  const handleDeleteChannelClick = (id) => {
    dispatch(setRemoveModalActive(true))
    dispatch(setIdForRemove(id))
  }

  const handleEditChannelClick = (channel) => {
    dispatch(setEditModalActive(true))
    dispatch(setChannelForEdit(channel))
  }

  return (
    <Dropdown as={ButtonGroup} className= "d-flex" onClick = {() => clickChannelHandler(channelData)}>
      <Button 
        variant= {(currentChannel.id === channelData.id) ? 'secondary' : 'light'} 
        className={cn('w-100', 'rounded-0', 'text-start', 'btn',
          { 'btn-secondary': (currentChannel.id === channelData.id) })}>
        <span className="me-1">#</span>
        {Profanity.check(channelData.name) ? Profanity.clean(channelData.name):channelData.name}
      
      </Button>

      <Dropdown.Toggle 
        split 
        variant= {(currentChannel.id === channelData.id) ? 'secondary' : 'light'} 
        id="dropdown-channel-control" 
        className="flex-grow-0"
      >
        <span className="visually-hidden">Управление каналом</span>
      </Dropdown.Toggle>
                    
      <Dropdown.Menu 
        className="dropdown-menu" 
        style={{ 
          position: 'absolute', 
          inset: '0px auto auto 0px', 
          transform: 'translate(0px, 40px)',
        }}
      >
        <Dropdown.Item href="#" className="dropdown-item" onClick={() => handleDeleteChannelClick(channelData.id)}>{t('dropdownMenu.removeField')}</Dropdown.Item>
        <Dropdown.Item href="#" className="dropdown-item" onClick={() => handleEditChannelClick(channelData)}>{t('dropdownMenu.editField')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default RemovableChannel
