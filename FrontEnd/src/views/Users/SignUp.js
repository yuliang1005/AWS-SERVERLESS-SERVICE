import React from 'react'
import './SignIn.scss'
import SignUpForm from '../../components/SignUpForm'
import { Card } from 'antd'

export default function SignUp() {
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
                <SignUpForm />

            </Card>
        </div>
    )
}
