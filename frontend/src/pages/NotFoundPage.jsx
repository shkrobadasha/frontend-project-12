import { useTranslation } from 'react-i18next'
const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">{t('navbarTitle')}</a>
        </div>
      </nav>
      <h1>
        {t('notFoundPage.noPageTitle')}
      </h1>
    </div>
  )
}

export default NotFoundPage
