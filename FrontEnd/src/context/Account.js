import React, { createContext, useState } from 'react'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { message } from 'antd'
import UserPool from '../utils/UserPool'
import { setSession } from '../context/Session'
import { useNavigate } from 'react-router-dom'

const AccountContext = createContext()

function Account(props) {
    const navigate = useNavigate()
    const [validateUsername, setValidateUsername] = useState('')
    const [verifyProcess, setVerifyProcess] = useState(false)

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser()
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(session)
                    }
                })
            }
        })
    }
    const authenticate = async (username, password) => {
        return await new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: username,
                Pool: UserPool,
            })

            const authDetails = new AuthenticationDetails({
                Username: username,
                Password: password
            })

            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    message.success('Welcome, ' + username + '!')
                    setSession(data)
                    resolve(data)
                    navigate('/image/upload')
                },
                onFailure: (err) => {
                    if (err.code === 'UserNotConfirmedException') {
                        message.warning('User is not verified, please verify your email.')
                        setValidateUsername(username)
                        setVerifyProcess(true)
                    } else {
                        message.error(err.message)
                    }
                    reject(err)
                }
            })
        })
    }

    return (
        <AccountContext.Provider value={{ authenticate, getSession, validateUsername, verifyProcess }}>
            {props.children}
        </AccountContext.Provider>
    )
}

export { Account, AccountContext }
