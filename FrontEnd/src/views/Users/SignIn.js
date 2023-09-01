import React from 'react'
import './SignIn.scss'
import { Card, Divider, Button } from 'antd'
import LoginForm from '../../components/LoginForm'
import GLogin from '../../components/GLogin'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
    const navigate = useNavigate()
    return (
        <div className='sign-in'>
            <div className="gradient"></div>
            <Card bordered={false} style={{
                width: '600px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                padding: '20px',
                transform: 'translate(-50%,-50%)'
            }}>
                <LoginForm />

                <Divider>OR</Divider>
                <GLogin />
            </Card>
        </div>
    )
}
