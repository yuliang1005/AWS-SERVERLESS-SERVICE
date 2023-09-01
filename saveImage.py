import boto3
import base64
import json
import uuid

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # 解析图像数据和文件名
    image_data = event['image']
    filename = event['filename']

    # 图像数据是 base64 编码的，所以我们需要解码
    image_data = base64.b64decode(image_data)

    # 生成一个唯一的文件名
    unique_filename = str(uuid.uuid4()) + '_' + filename

    # 上传图像到 S3
    s3.put_object(Body=image_data, Bucket='5225ass2', Key='image/' + unique_filename)

    # 创建 S3 URL
    s3_url = f"s3://5225ass2/image/{unique_filename}"

    # 返回 S3 URL
    return {
        'statusCode': 200,
        'body': json.dumps({'s3_url': s3_url})
    }
