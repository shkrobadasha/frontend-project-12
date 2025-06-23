
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLeave = () => {
    navigate('/login')
    localStorage.removeItem('userId')
  }

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('navbarTitle')}</a>
        <button type='button' className="btn btn-primary" onClick={handleLeave}>{t('exitButton')}</button>
      </div>
    </nav>
  )
}

export default Navbar
