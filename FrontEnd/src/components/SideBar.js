import React from 'react'
import { Menu } from 'antd'
import {
  SearchOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {
  const navigate = useNavigate()
  const items = [
    {
      key: 'image',
      icon: <FileImageOutlined />,
      label: 'Image Processing',
      children: [
        {
          key:'/image/upload',
          label:'Upload'
        },{
          key:'/image/delete',
          label:'Delete'
        }
      ]
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: 'Search',
      children:[
        {
          key:'/search/by-tags',
          label:'By Tags'
        },{
          key:'/search/by-image',
          label:'By Image'
        },{
          key:'/search/update-tags',
          label:'Update Tags'
        }
      ]
    }
  ]
  return (
    <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/image/upload']}
          items={items}
          onClick={(e)=>{
            navigate(e.key)
          }}
        />
  )
}
