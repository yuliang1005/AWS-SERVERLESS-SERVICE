import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import VerifyCode from './VerifyCode'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { message } from 'antd'
import UserPool from '../utils/UserPool'
import { setSession, setUsername } from '../context/Session'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [validateUsername, setValidateUsername] = useState('')
  const [verifyProcess, setVerifyProcess] = useState(false)

  const onFinish = (values) => {
    setLoading(true)
    let { username, password } = values
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
        message.success('Welcome, ' + data.idToken.payload.email + '!')
        setSession(data)
        setUsername(data.idToken.payload.email)
        window.location.href = '/image/upload'
      },
      onFailure: (err) => {
        if (err.code === 'UserNotConfirmedException') {
          message.warning('User is not verified, please verify your email.')
          setValidateUsername(username)
          setVerifyProcess(true)
        } else {
          message.error(err.message)
        }
      }
    })

    setLoading(false)
  }
  return (
    <div>
      {verifyProcess === false ?
        <div>
          <Title level={2}>Login your account</Title>
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
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your email address!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
          <Button type='link' onClick={() => {
            navigate('/sign-up')
          }}>create a new account</Button>
        </div>
        :
        <VerifyCode validateUsername={validateUsername} />
      }
    </div>
  )
}
