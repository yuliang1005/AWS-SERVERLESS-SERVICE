import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import Title from 'antd/es/typography/Title'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'
import UserPool from '../utils/UserPool'
import VerifyCode from './VerifyCode'
import { useNavigate } from 'react-router-dom'

export default function SignUpForm() {
  const navigate = useNavigate()
  const [verifyProcess, setVerifyProcess] = useState(false)
  const [validateUsername, setValidateUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)

  const onFinish = (values) => {
    setLoading(true)
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'phone_number',
        Value: values.phone_number,
      }),
      new CognitoUserAttribute({
        Name: 'family_name',
        Value: values.family_name,
      }),
      new CognitoUserAttribute({
        Name: 'given_name',
        Value: values.given_name,
      }),
    ]
    UserPool.signUp(values.email, values.password, attributeList, null, (err, data) => {
      if (err) {
        message.error("Couldn't sign up, " + err.message)
      } else {
        console.log(data)
        setVerifyProcess(true)
        setValidateUsername(values.email)
        message.success('User Added Successfully');
      }
    })
    setLoading(false)
  }


  return (
    <div>
      {verifyProcess === false ?
        <div>
          <Title level={2}>Create a new account</Title>
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
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email address!',
                },
              ]}
            >
              <Input placeholder='name@host.com' />
            </Form.Item>

            <Form.Item
              label="Family Name"
              name="family_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your family name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Given Name"
              name="given_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your given name!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Input placeholder='+12125551234' />
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

              <Input.Password onFocus={() => setHintOpen(true)} onBlur={() => { setHintOpen(false) }} />


            </Form.Item>

            {hintOpen && <div style={{ color: '#A9A9A9' }}>
              <b>Password must match:</b>
              <ul>
                <li>contain a lower case letter</li>
                <li>contain a number</li>
                <li>at least 8 characters</li>
                <li>not contain a leading or trailing space</li>
              </ul>
            </div>}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <Button type='link' onClick={() => {
            navigate('/sign-in')
          }}>sign in your account</Button>
        </div>
        :
        <VerifyCode validateUsername={validateUsername} />
      }

    </div>
  )
}
