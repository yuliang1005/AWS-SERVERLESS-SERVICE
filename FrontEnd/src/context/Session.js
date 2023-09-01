const setSession = (session) => {
    sessionStorage.setItem('session', JSON.stringify(session))
}

const setUsername = (username) => {
    sessionStorage.setItem('username', username)
}

const getSession = () => {
    return JSON.parse(sessionStorage.getItem('session'))
}

const getUsername = () => {
    return sessionStorage.getItem('username')
}

const removeSession = () => {
    sessionStorage.removeItem('session')
}

const removeUsername = () => {
    sessionStorage.removeItem('username')
}

export { setSession, setUsername, getSession, getUsername, removeSession, removeUsername }