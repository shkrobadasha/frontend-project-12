import { useSelector } from 'react-redux'
import * as Profanity from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import MessageForm from './MessageForm'
import { useEffect } from 'react'

const ChatContent = () => {
  const { t } = useTranslation()
  const currentMessages = useSelector(state => state.messages.messages)
  const currentChannel = useSelector(state => state.channels.currentChannel)

  const getMessagesOfCurrentChannel = (messages) => {
    const currentMessages = messages.filter(message => message.channelId === currentChannel.id)
    return currentMessages
  }

  useEffect(() => {
    const messagesBox = document.getElementById("messages-box");
    if (messagesBox) {
      messagesBox.scrollTo(0, messagesBox.scrollHeight);
    }
  }, [ getMessagesOfCurrentChannel(currentMessages)]);

  const renderMessages = () => {
    const curMessages = getMessagesOfCurrentChannel(currentMessages)
    if (curMessages.length === 0) {
      return <div id="messages-box" className="chat-messages overflow-auto px-5" />
    }

    return (
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {curMessages.map(message => (
          <div className="text-break mb-2" key={message.id}>
            <b>{message.username}</b>
            :
            {Profanity.check(message.body) ? Profanity.clean(message.body) : message.body}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {currentChannel.name}
            </b>
          </p>
          <span className="text-muted">{t('mainPage.messagesCounter.count', { count: getMessagesOfCurrentChannel(currentMessages).length })}</span>
        </div>
        {renderMessages()}
        <MessageForm />
      </div>
    </div>
  )
}

export default ChatContent
