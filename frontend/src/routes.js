
const apiPath = '/api';

export default {
    loginPath: () => [apiPath, 'login'].join('/'),
    usersPath: () => [apiPath, 'data'].join('/')
}