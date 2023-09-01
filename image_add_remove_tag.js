const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async(event, context, callback) => {
   console.log('remaining time =', context.getRemainingTimeInMillis());
   console.log('functionName =', context.functionName);
   console.log('AWSrequestID =', context.awsRequestId);
   let body;
   let statusCode = '200';
   const headers = {'Content-Type': 'application/json',};
   let returnMessage = '';
   const tableName = 'image_store2';
   try {
       switch (event.httpMethod) {
           case 'DELETE':
               break;
           case 'GET':
              break;
           case 'POST':
                const inputUrl = event.url;
                const inputUser = event.username;
                const addOrRemove = event.type;
                const tagsAmount =  event.tags.length;
                const tagListCounted = [];
                for (var i = 0; i < tagsAmount; i++){
                    const howMCount = parseInt(event.tags[i].count);
                    for (var x = 0; x < howMCount; x++){
                        tagListCounted.push(event.tags[i].tag);
                    }
                }

                if (addOrRemove == 1) {
                    const updateParams = {
                        TableName: tableName,
                        Key: {
                            s3_url: inputUrl,
                            username: inputUser,
                        },
                        UpdateExpression: 'SET tags = list_append(tags, :newValue)',
                        ExpressionAttributeValues: {
                            ':newValue': tagListCounted, 
                        },
                        ReturnValues: 'ALL_NEW',
                    };
                    body = await dynamo.update(updateParams).promise();
                    returnMessage = "Successfully inserted tags for " + inputUrl;
                } else if (addOrRemove == 0){
                    let params = {
                        TableName: tableName, 
                        FilterExpression: "s3_url = :newValue",
                        ExpressionAttributeValues: { 
                            ":newValue": inputUrl 
                        },
                    };
                    const scannedItem = await dynamo.scan(params).promise();
                    // Because id is the primary key therefore only one return
                    // If error then it is due to the database
                    const tagsOrigin = scannedItem.Items[0].tags;

                    const tagListCountedNumber = tagListCounted.length;
                    for (var i = 0; i < tagListCountedNumber; i++){
                        const index = tagsOrigin.indexOf(tagListCounted[i]);
                        if (index > -1) {
                            tagsOrigin.splice(index, 1); 
                        }
                    }
                    const updateParams = {
                        TableName: tableName,
                        Key: {
                            username: inputUser,
                            s3_url: inputUrl,
                        },
                        UpdateExpression: 'SET tags = :newValue',
                        ExpressionAttributeValues: {
                            ':newValue': tagsOrigin, 
                        },
                        ReturnValues: 'ALL_NEW',
                    };
                    body = await dynamo.update(updateParams).promise();
                    returnMessage = "Successfully removed tags for " + inputUrl;
                }
               break;
           case 'PUT':
               break;
           default:
               throw new Error(`Unsupported method "${event.httpMethod}"`);
       }
   }
   catch (err) {
       statusCode = '400';
       body = err.message;
   }
   finally {body = JSON.stringify(body);}
   return {statusCode, body, returnMessage, headers};
};
