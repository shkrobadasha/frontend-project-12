import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './slices/index.js'
import 'bootstrap/dist/css/bootstrap.min.css'
// eslint-disable-next-line no-unused-vars
import i18next from './18n.js'
import Socket from './components/Socket.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Socket>
        <App />
      </Socket>
    </Provider>
  </StrictMode>,
)
