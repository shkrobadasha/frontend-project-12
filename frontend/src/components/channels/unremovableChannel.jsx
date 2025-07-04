import { useSelector, useDispatch } from 'react-redux'
import * as Profanity from 'leo-profanity'
import cn from 'classnames'
import { setCurrentChannel } from '../../slices/channelsSlice.js'

const UnremovableChannel = ({ channelData }) => {
  const dispatch = useDispatch()
  const currentChannel = useSelector(state => state.channels.currentChannel)

  const clickChannelHandler = (channelData) => {
    dispatch(setCurrentChannel(channelData))
  }

  return (
    <button
      type="button"
      onClick={() => clickChannelHandler(channelData)}
      className={cn('w-100', 'rounded-0', 'text-start', 'btn', { 'btn-secondary': (currentChannel.id === channelData.id) })}
    >
      <span className="me-1">#</span>
      {Profanity.check(channelData.name) ? Profanity.clean(channelData.name) : channelData.name}
    </button>
  )
}

export default UnremovableChannel
