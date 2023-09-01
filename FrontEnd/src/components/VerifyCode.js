import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import Title from 'antd/es/typography/Title'
import { CognitoUser } from 'amazon-cognito-identity-js'
import UserPool from '../utils/UserPool'
import { useNavigate } from 'react-router-dom'

export default function VerifyCode(props) {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const { validateUsername } = props

    const verifyAccount = () => {
        setLoading(true)
        const user = new CognitoUser({
            Username: validateUsername,
            Pool: UserPool,
        })
        console.log(user);
        user.confirmRegistration(code, true, (err) => {
            if (err) {
                console.log(err)
                message.error("Couldn't verify account, " + err.message)
            } else {
                message.success('Account verified successfully')
                window.location.href = '/sign-in'
            }
        })
        setLoading(false)
    }
    return (
        <div>
            <Title level={3}>Email Verification</Title>
            <p style={{ color: 'grey' }}>We have send an email with a verification code to your registered email address, please enter the code below:</p>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: '400px',
                    marginTop: '20px'
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={verifyAccount}
                autoComplete="off"
            >

                <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the verfication code!',
                        },
                    ]}
                >
                    <Input onChange={(e) => { setCode(e.target.value) }} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Verify
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
