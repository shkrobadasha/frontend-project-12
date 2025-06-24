export default {
  translation: {
    navbarTitle: 'Hexlet Chat',
    userName: 'Ваш ник',
    password: 'Пароль',
    exitButton: 'Выйти',
    loginPage: {
      loginTitle: 'Войти',
      title: 'Нет аккаунта?',
      signUpLink: 'Регистрация',
    },
    signUpPage: {
      signUpTitle: 'Регистрация',
      userName: 'Имя пользователя',
      confirmPassword: 'Подтвердите пароль',
      signUpButton: 'Зарегестрироваться',
    },
    mainPage: {
      channelsTitle: 'Каналы',
      messagesDefaultText: 'Введите сообщение...',
      messagesCounter: {
        count_one: '{{count}} сообщение',
        count_few: '{{count}} сообщения',
        count_many: '{{count}} сообщений',
      },
    },
    notFoundPage: {
      noPageTitle: '404 (такой страницы нет)',
    },
    dropdownMenu: {
      editField: 'Переименовать',
      removeField: 'Удалить',
    },
    modalWindow: {
      windowsButtons: {
        sendButton: 'Отправить',
        cancelButton: 'Отменить',
        removeButton: 'Удалить канал',
      },
      windowsTitles: {
        addTitle: 'Добавить канал',
        editTitle: 'Переименовать канал',
        removeTitle: 'Удалить канал',
        clarifyingRemoveTitle: 'Уверены?',
        channelName: 'Имя канала',
      },
    },
    errors: {
      requiredField: 'Обязательное поле',
      loginError: 'Неверные имя пользователя или пароль',
      nameLengthError: 'От 3 до 20 символов',
      passwordLengthError: 'Не менее 6 символов',
      confirmPasswordError: 'Пароли должны совпадать',
      alreadyExistsUserError: 'Такой пользователь уже существует',
      alreadyExistsChannelError: 'Должно быть уникальным',
      networkError: 'Ошибка соединения',
      serverLoadDataError: 'Ошибка загрузки данных',
      userLoginError: "Этот пользователь не авторизован",
    },
  },
}
