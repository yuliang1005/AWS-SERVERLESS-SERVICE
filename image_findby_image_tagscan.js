const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const isMultiSubset = (targetArrat, inputArray) => {
  const mapInprogress = new Map;
  for(const element of targetArrat) 
    mapInprogress.set(element, (mapInprogress.get(element) ?? 0) + 1);
  for(const element of inputArray)
    if (mapInprogress.has(element))
       mapInprogress.set(element, mapInprogress.get(element) - 1);
  return [...mapInprogress.values()].every(count => count <= 0);   
};

exports.handler = async(event, context, callback) => {
   console.log('remaining time =', context.getRemainingTimeInMillis());
   console.log('functionName =', context.functionName);
   console.log('AWSrequestID =', context.awsRequestId);
   let body;
   let statusCode = '200';
   const headers = {'Content-Type': 'application/json',};
   const tableName = 'image_store2';
   try {
       switch (event.httpMethod) {
           case 'DELETE':
               break;
           case 'POST':
                if (event.username){
                    const inputUser = event.username;
                    let params = {
                        TableName: tableName, 
                        FilterExpression: "username = :newValue",
                        ExpressionAttributeValues: { 
                            ":newValue": inputUser 
                            },
                    };
                    body = await dynamo.scan(params).promise();
                    const tagsList = event.tags;
                    const bodyLenth = body.Items.length;
                    let links = [];
                    for (var i = 0; i < bodyLenth; i++) {
                      if (isMultiSubset(tagsList,body.Items[i].tags)){
                          links.push(body.Items[i].s3_url)
                      }
                    }
                    body = links;
                }
              break;
           case 'GET':
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
   return {statusCode, body,headers,};
};