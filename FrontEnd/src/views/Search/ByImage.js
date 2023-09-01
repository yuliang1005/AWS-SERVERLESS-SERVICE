import Title from 'antd/es/typography/Title'
import React, { useState } from 'react'
import ImageUpload from '../../components/ImageUpload'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { Image } from 'antd'

export default function ByImage() {
  const [imageSrcList, setImageSrcList] = useState([])
  return (
    <div>
      <Title level={3} setImageSrcList={(list) => setImageSrcList(list)}>Find Images By an Image</Title>
      <ImageUpload setImageSrcList={(list) => setImageSrcList(list)} flag={'N'} />
      {imageSrcList && <div style={{ textAlign: 'center' }}>
        {imageSrcList.length > 0 &&
          <>
            <div style={{ margin: '20px' }}>
              <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '30px', width: '50px' }} /></span>
              <span style={{ fontSize: '20px' }}>We've find these images below:</span>
            </div>
            {imageSrcList.map(item =>
              <div style={{ marginTop: '20px' }} key={item}>
                <Image src={item} alt={item} style={{ height: '300px' }} />
                <br />
              </div>
            )}</>
        }

      </div>}
    </div>
  )
}
