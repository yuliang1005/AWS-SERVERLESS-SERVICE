import React, { useState } from 'react'
import { Button, Input, Space, Tag, message, Image } from 'antd'
import Title from 'antd/es/typography/Title'
import axios from 'axios'
import { PlusOutlined, CheckCircleTwoTone, SearchOutlined } from '@ant-design/icons'
const { Search } = Input

export default function ByTags() {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState([])
  const [addTagName, setAddTagName] = useState('')
  const [addTagCount, setAddTagCount] = useState(1)
  const [imageSrcList, setImageSrcList] = useState([])

  const onSearch = () => {
    setLoading(true)
    let request = 'https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/image_query?username=' + sessionStorage.getItem('username') + '&' + combineParams()
    console.log(request)
    axios.get(request).then(res => {
      console.log(res.data)
      if (res.data.length === 0) {
        message.error('Sorry, we cannot find this image.')
      } else {
        setImageSrcList(res.data)
      }
      setLoading(false)
    }).catch((err) => {
      message.error('Some error occurs, please try again.')
      setLoading(false)
    })

  }
  const combineParams = () => {
    let param = ''
    if (tags.length > 0) {
      for (let i of tags) {
        param += 'tag=' + i.name + '&tagCount=' + i.count + '&'
      }
    }
    return param
  }
  const handleAddTag = () => {
    if (addTagName && addTagCount) {
      if (tags && checkTagNameExists()) {
        message.error('this tag name is exists!')
      } else {
        let tag = {
          name: addTagName,
          count: addTagCount
        }
        setTags([...tags, tag])
        setAddTagName('')
        setAddTagCount(1)
      }
    } else {
      message.error('please enter a tag name and count!')
    }
  }

  const checkTagNameExists = () => {
    for (let i of tags) {
      if (i.name === addTagName) {
        return true
      }
    }
    return false
  }
  const handleRemoveTag = (name) => {
    let newTags = tags.filter(tag => tag.name !== name)
    setTags(newTags)
  }
  return (
    <div>
      <Title level={3}>Find Images By Tags</Title>
      <Space>
        <p>Tags: </p>
        {tags.map(item =>
          <Tag key={item.name} closable onClose={() => handleRemoveTag(item.name)}>{item.name}: {item.count}</Tag>
        )}
      </Space>
      <Title level={5}>Add a tag: </Title>
      <Space>
        <label>Tag name: </label>
        <Input onChange={(e) => setAddTagName(e.target.value)} value={addTagName} />
        <label>Count: </label>
        <Input type='number' min={1} value={addTagCount} onChange={(e) => setAddTagCount(e.target.value)} />
        <Button type='text' shape='circle' style={{ color: 'green' }} size='large' icon={<PlusOutlined />} onClick={handleAddTag}></Button>
      </Space>
      <br />
      <Button icon={<SearchOutlined />} type='primary' loading={loading} onClick={onSearch}>Search</Button>
      {imageSrcList.length > 0 && <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '20px' }}>
          <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '30px', width: '50px' }} /></span>
          <span style={{ fontSize: '20px' }}>We've find these images below:</span>
        </div>
        {imageSrcList.map(item =>
          <div key={item} style={{ marginTop: '20px' }}>
            <Image src={item} alt={item} style={{ height: '300px' }} />
          </div>
        )}
      </div>}
    </div>
  )
}
