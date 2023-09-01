import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Popover, message, theme } from 'antd';
import { useState } from 'react';
import SideBar from '../components/SideBar';
import FunctionRouter from '../router/FunctionRouter';
import { useNavigate } from 'react-router-dom'
import { removeSession, removeUsername } from '../context/Session'
import UserPool from '../utils/UserPool';
import { googleLogout } from '@react-oauth/google';

const { Header, Sider, Content } = Layout;
const Home = () => {
  const [collapsed, setCollapsed] = useState(false)
  const username = sessionStorage.getItem('username')
  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const handleLogout = () => {
    let user = UserPool.getCurrentUser()
    if (user) {
      user.signOut(() => {
        removeSession('session')
        removeUsername('username')
        message.success('Logout Success!')
        navigate('/sign-in')
      })
    } else {
      googleLogout()
      removeSession('session')
      removeUsername('username')
      message.success('Logout Success!')
      navigate('/sign-in')
    }
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <SideBar></SideBar>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ float: 'right', transform: 'translateX(-24px)' }}>
            Welcome,<Popover title={() => {
              return <Button type='link' danger onClick={handleLogout}>Logout</Button>
            }}><Button type='link'>{username && username}</Button></Popover>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <FunctionRouter></FunctionRouter>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Home