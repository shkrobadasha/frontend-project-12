export default {
    translation: {
        navbarTitle: "My Chat",
        userName: "Имя пользователя",
        password: "Пароль",
        loginPage: {
            loginTitle: 'Войти',
            title: "Нет аккаунта?",
            signUpLink: "Регистрация",
        },
        signUpPage: {
            signUpTitle: "Регистрация",
            confirmPassword: "Подтвердить пароль",
            signUpButton: "Зарегестрироваться"
        },
        mainPage: {
            channelsTitle: "Каналы",
            messagesDefaultText: "Введите сообщение...",
            
            //добавить эти в и спользование
            messagesCounter: {
                count_one: '{{count}} сообщение',
                count_few: '{{count}} сообщения',
                count_many: '{{count}} сообщений',
            },
        },
        notFoundPage: {
            noPageTitle: "404 (такой страницы нет)",
        },
        dropdownMenu: {
            editField: "Переименовать",
            removeField: "Удалить",
        },
        modalWindow:{
            windowsButtons: {
                sendButton: "Отправить",
                cancelButton: "Отменить",
                removeButton: "Удалить канал",
            },
            windowsTitles: {
                addTitle: "Добавить канал",
                editTitle: "Переименовать канал",
                removeTitle: "Удалить канал",
                clarifyingRemoveTitle: "Уверены?",
                
            },
        },
        errors:{
            requiredField: "Обязательное поле",
            loginError: "Неверный логин или пароль",
            nameLengthError: "От 3 до 20 символов",
            passwordLengthError: "Не менее 6 символов",
            confirmPasswordError: "Пароли должны совпадать",
            alreadyExistsUserError: "Такой пользователь уже существует",
            alreadyExistsChannelError:"Должно быть уникальным",


        }

    }
}
//еще ошибки нужно добави