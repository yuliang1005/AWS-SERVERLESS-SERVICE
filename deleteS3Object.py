import boto3
import json

s3 = boto3.client('s3')

def lambda_handler(event, context):

    if isinstance(event['body'], str):
        body = json.loads(event['body'])
    
    else:
        body = event['body']
        
    # get the filename
    object_url = body['object_url']

    filename = object_url.split('/')[-1]

    # Delete the file
    response = s3.delete_object(
        Bucket='5225ass2',
        Key='image/' + filename
    )

    # Return a response
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
