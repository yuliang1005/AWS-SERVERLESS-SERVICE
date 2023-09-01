import boto3
import json

# Establish a boto3 session
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    print(json.dumps(event)) 
    # Parse incoming event
    #data = json.loads(event['body'])

    # Access the 'object_url' and 'labels' fields
    username = event['username']
    s3_url = event['object_url']
    tags = event['labels']

    # Specify your DynamoDB table
    table = dynamodb.Table('image_store')

    # Create a new item to insert into the table
    item = {
        's3_url': s3_url,
        'username': username,
        'tags': tags
    }

    # Put the item into the table
    response = table.put_item(Item=item)

    # Return a response
    return {
        'statusCode': 200,
        'body': 'Image stored successfully'
    }
