import Title from 'antd/es/typography/Title'
import React, { useState } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { Button, Tag } from 'antd'
import { Link } from 'react-router-dom'

export default function Uploading() {
  const [image, setImage] = useState(null)
  return (
    <div>
      <Title level={3}>Upload an image</Title>
      <ImageUpload flag={''} setImage={(image) => setImage(image)} />
      <br />
      {image && <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '20px' }}>
          <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '30px', width: '50px' }} /></span>
          <span style={{ fontSize: '20px' }}>Image upload successfully:</span>
        </div>
        <div>You can view this image from this link: <Link to={image.object_url}>{image.object_url}</Link></div>
        <div>Tags: {image.labels.length > 0 ?
          image.labels.map(label =>
            <Tag key={label}>{label}</Tag>
          )
          :
          <span>null</span>
        }</div>
      </div>}
    </div>
  )
}
