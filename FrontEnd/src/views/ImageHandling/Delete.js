import React, { useState } from 'react'
import { Button, Image, Input, message, Popover } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'
import { CheckCircleTwoTone, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
const { Search } = Input

export default function Delete() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const onSearch = (value) => {
    setLoading(true)
    axios.get(value).then(res => {
      setLoading(false)
      if (res.data && typeof res.data === 'string') {
        setImageUrl(value)
      } else {
        message.error('sorry, we can accept only 1 image at once.')
      }
    }).catch(() => {
      setLoading(false)
      message.error('sorry, we cannot find image from this url.')
    })

  }
  const handleDelete = () => {
    setOpen(false)
    setDeleteLoading(true)
    let headers = {
      username: sessionStorage.getItem('username'),
      object_url: imageUrl
    }
    console.log(headers)
    axios.delete('https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/image_delete', {
      data: { ...headers }
    }).then((res) => {
      console.log(res)
      setImageUrl('')
      if (res.data.statusCode == 200) {
        message.success(res.data.body)
      } else {
        message.warning(res.data.body)
      }
      setDeleteLoading(false)
    }).catch(() => {
      message.error('image delete error, please try to delete it again.')
      setDeleteLoading(false)
    })
  }
  const PopoverContent = (
    <span style={{ fontSize: '15px' }}>Do you want to delete this image?
      <Button type='primary' shape='circle' icon={<CheckOutlined />} style={{ marginLeft: '10px' }} onClick={handleDelete}></Button>
      <Button type='primary' shape='circle' icon={<CloseOutlined />} danger style={{ marginLeft: '10px' }} onClick={hide}></Button>
    </span>
  )
  return (
    <div>
      <Title level={3}>Delete an image</Title>
      <Search
        placeholder="input the image url..."
        enterButton="Search"
        size="large"
        loading={loading}
        onSearch={onSearch}
      />
      {imageUrl && <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '20px' }}>
          <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '30px', width: '50px' }} /></span>
          <span style={{ fontSize: '20px' }}>Success! Please check the image below:</span>
        </div>

        <Image src={imageUrl} alt="Decoded Image" style={{ height: '300px' }} />

        <div style={{ marginTop: '20px' }}>
          <Popover
            content={PopoverContent}
            title="delete this image"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Button type="primary" danger shape='circle' style={{ height: '50px', width: '50px' }} icon={<DeleteOutlined />} loading={deleteLoading}></Button>
          </Popover>

        </div>
      </div>}
    </div>
  )
}
