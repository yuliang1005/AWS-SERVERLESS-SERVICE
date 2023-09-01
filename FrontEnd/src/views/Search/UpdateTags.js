import React, { useState } from 'react'
import { Button, Image, Input, message, Tabs, Space, Tag, Popconfirm } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'
import { CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons'
const { Search } = Input

export default function UpdateTags() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [addedTags, setAddedTags] = useState([])
  const [addTagName, setAddTagName] = useState('')
  const [addTagCount, setAddTagCount] = useState(1)
  const [removedTags, setRemovedTags] = useState([])


  const checkResponse = (response) => {
    if (typeof response === 'string' && !Array.isArray(response) && response !== null) {
      return true
    } else {
      return false
    }
  }

  const onSearch = (value) => {
    setLoading(true)
    axios.get(value).then(res => {
      setLoading(false)
      if (checkResponse(res.data) && res.status === 200) {
        setImageUrl(value)
      } else {
        message.error('sorry, we can accept only 1 image at once.')
      }
    }).catch(() => {
      setLoading(false)
      message.error('sorry, we cannot find image from this url.')
    })

  }
  const handleAddTag = () => {
    if (addTagName && addTagCount) {
      if (addedTags && checkTagNameExists()) {
        message.error('this tag name is exists!')
      } else {
        let tag = {
          tag: addTagName,
          count: addTagCount
        }
        setAddedTags([...addedTags, tag])
        setAddTagName('')
        setAddTagCount(1)
      }
    } else {
      message.error('please enter a tag name and count!')
    }
  }
  const checkTagNameExists = () => {
    for (let i of addedTags) {
      if (i.name === addTagName) {
        return true
      }
    }
    return false
  }
  const handleRemoveTag = (name) => {
    let newTags = addedTags.filter(tag => tag.name !== name)
    setAddedTags(newTags)
  }

  const handleSaveAdd = (type) => {
    if (addedTags.length > 0) {
      saveTags(type)
    } else {
      message.error('please add tags at first!')
    }
  }
  const saveTags = (type) => {
    let data = {
      username: sessionStorage.getItem('username'),
      url: imageUrl,
      type: type,
      tags: addedTags,
      httpMethod: "POST"
    }
    console.log(data)
    axios.post('https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/tag_update', data).then((res) => {
      console.log(res)
      message.info(res.data.returnMessage)
    }).catch(err => {
      console.log(err)
      message.error('Some error occurs, please try again.')
    })
  }
  return (
    <div>
      <Title level={3}>Update the image tags</Title>
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
          <span style={{ fontSize: '20px' }}>We have found this image below:</span>
        </div>
        <Image src='https://5225ass2.s3.amazonaws.com/image/17c2a617-7111-4192-9c03-e8828b32f1ac_your-filename.jpg' alt={imageUrl} style={{ height: '300px' }} />
        <br />
        <Space>
          <p>Tags you want to add/delete: </p>
          {
            addedTags.map(item =>
              <Tag key={item.tag} closable onClose={() => handleRemoveTag(item.tag)}>{item.tag}: {item.count}</Tag>
            )
          }
        </Space>
        < Title level={5} > Insert a tag: </Title >
        <Space>
          <label>Tag name: </label>
          <Input onChange={(e) => setAddTagName(e.target.value)} value={addTagName} />
          <label>Count: </label>
          <Input type='number' min={1} value={addTagCount} onChange={(e) => setAddTagCount(e.target.value)} />
          <Button type='text' shape='circle' style={{ color: 'green' }} size='large' icon={<PlusOutlined />} onClick={handleAddTag}></Button>
        </Space>
        <br /><br />
        <Popconfirm title='add tags' description='Do you want to add these tags?' okText="Yes" cancelText="No" onConfirm={() => handleSaveAdd(1)}>
          <Button type='primary'>Add Tags</Button>
        </Popconfirm>

        <Popconfirm title='delete tags' description='Do you want to delete these tags?' okText="Yes" cancelText="No" onConfirm={() => handleSaveAdd(0)}>
          <Button style={{ marginLeft: '20px' }} danger>Delete Tags</Button>
        </Popconfirm>

      </div>}

    </div>
  )
}
