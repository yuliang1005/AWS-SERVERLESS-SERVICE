import boto3
import json

# Establish a boto3 session
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

def lambda_handler(event, context):

    # Access the 'object_url' and 'labels' fields
    username = event['username']
    s3_url = event['object_url']
    filename = s3_url.split('/')[-1]
    # Delete the file
    response = s3.delete_object(
        Bucket='5225ass2-32',
        Key='image/' + filename
    )

    # Delete the item from the table
    table = dynamodb.Table('image_store2')
    
    # Try to retrieve the item
    response = table.get_item(
        Key={
            'username': username,
            's3_url': s3_url
        }
    )
    
    # If the item was found, delete it
    if 'Item' in response:
        table.delete_item(
            Key={
                'username': username,
                's3_url': s3_url
            }
        )
        return {
            'statusCode': 200,
            'body': 'Image deleted successfully'
        }
    else:
        return {
            'statusCode': 404,
            'body': 'Image not found'
        }
