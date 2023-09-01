import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { setSession, setUsername } from '../context/Session'

export default function GLogin() {
    const [googleUser, setGoogleUser] = useState(null);


    const googleLogin = useGoogleLogin({
        onSuccess: (res) => {
            setGoogleUser(res)
            setSession(res)
        },
        onError: (err) => {
            message.error('Login Filed: ', err)
        }
    })
    useEffect(() => {
        if (googleUser && googleUser.access_token) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${googleUser.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setUsername(res.data.email)
                    message.success('Welcome, ', res.data.email)
                    window.location.href = '/image/upload'
                })
                .catch((err) => message.error(err))
        }
    }, [googleUser])
    return (
        <Button icon={<GoogleOutlined />} onClick={googleLogin}>use Google Login</Button>
    )
}
