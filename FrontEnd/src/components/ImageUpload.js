import React, { useState } from 'react';
import { InboxOutlined, FileImageOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal } from 'antd';
import axios from 'axios';

const { Dragger } = Upload;

export default function ImageUpload(props) {
    const [image, setImage] = useState(null)
    const [status, setStatus] = useState('uploading')
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof Blob)) {
                reject(new Error('Invalid file type'));
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (file) => {
        setStatus('uploading')
        setLoading(true)
        try {
            const base64Object = await getBase64(file)
            const removedTitle = base64Object.replace(/^data:image\/[a-z]+;base64,/, '');

            axios
                .post('https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/object_detection', {
                    body: {
                        flag: props.flag,
                        filename: file.name,
                        image: removedTitle,
                    }
                })
                .then((res) => {
                    setStatus('done')
                    console.log(res)
                    if (props.flag === 'N') {
                        console.log(res.data)
                        handleImageSearch(res.data.body)
                        setLoading(false)
                    } else {
                        console.log(res.data)
                        handleResponse(res.data.body)
                        if (res.data.statusCode === 200 && props.setImage) {
                            props.setImage(JSON.parse(res.data.body))
                        }
                        setLoading(false)
                    }

                })
                .catch((error) => {
                    setStatus('error') // Set upload status to 'error' for error
                    message.error(`${file.name} file upload failed, ` + error.message);
                    console.error('Error uploading image:', error);
                }).finally(
                    setLoading(false)
                )
        } catch (error) {
            console.error('Error converting image to Base64:', error);
        } finally {
            setLoading(false)
        }
    }
    const handleResponse = (response) => {
        let data = JSON.parse(response)
        let new_labels = []
        if (data.labels.length > 0) {
            for (let i of data.labels) {
                new_labels.push(i)
            }
        }
        let headers = {
            username: sessionStorage.getItem('username'),
            object_url: data.object_url,
            labels: new_labels
        }
        console.log(headers)
        axios.post('https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/image_store', headers).then(res => {
            console.log(res)
            if (res.data.body) {
                message.success(res.data.body)
            }
        }).catch(err => {
            message.error('upload failed,', err)
        })

    }

    const handleImageSearch = (JSONLabel) => {
        let labels = JSON.parse(JSONLabel).labels
        console.log(labels)
        if (labels && labels.length > 0) {
            axios.post('https://017u5n6sr8.execute-api.us-east-1.amazonaws.com/default/image_query_by_image', {
                username: sessionStorage.getItem('username'),
                tags: labels ? [...labels] : [],
                httpMethod: 'POST'
            }).then(res => {
                console.log(res)
                let result = JSON.parse(res.data.body)
                if (props.setImageSrcList && result.length > 0) {
                    props.setImageSrcList(result)
                } else {
                    message.warning('Sorry, we cannot find any relative image.')
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            message.warning('Sorry, we cannot recognise any tag from this image.')
        }
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleCancel = () => setPreviewOpen(false);

    const spec = {
        name: 'file',
        multiple: false,
        accept: '.jpg,.png',
        maxCount: 1,
        customRequest: (item) => { setImage(item) },
        iconRender: () => {
            if (status === 'done') {
                return <FileImageOutlined />
            }
        },
        progress: {
            strokeWidth: 3,
            status: () => {
                if (status === 'done') {
                    return 'success'
                } else if (status === 'error') {
                    return 'exception'
                }
                return 'normal'
            },
            success: {
                percent: status === 'done' && 100
            },
            format: () => {
                if (status === 'done') {
                    return 100
                }
                return 0
            }
        },
        onPreview: handlePreview
    };

    return (
        <div>
            <Dragger {...spec}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag an image to this area to upload</p>
                <p className="ant-upload-hint">
                    You can upload only <b>ONE</b> .jpg or .png image.
                </p>
            </Dragger>
            <Button type="primary" style={{ float: 'right', marginTop: '20px' }} onClick={() => handleUpload(image.file)} loading={loading}>
                Upload
            </Button>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
}
