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
           case 'GET':
              if (event.queryStringParameters &&
                    event.queryStringParameters.username){
                        const inputUsername =  event.queryStringParameters.username
                        let params = {
                        TableName: tableName, 
                        FilterExpression: "username = :newValue",
                        ExpressionAttributeValues: { 
                            ":newValue": inputUsername 
                            },
                        };
                      body = await dynamo.scan(params).promise();
               
                      const bodyLenth = body.Items.length;
                      const links = [];
                      const tagListCounted = [];
                      if (event.multiValueQueryStringParameters && 
                            event.multiValueQueryStringParameters.tag && 
                            event.multiValueQueryStringParameters.tagCount){
                        const tagList = event.multiValueQueryStringParameters.tag;
                        const tagCountList = event.multiValueQueryStringParameters.tagCount;
                        const tagCountLenth = tagCountList.length;
                        for (var i = 0; i < tagCountLenth; i++){
                            const howMCount = parseInt(tagCountList[i]);
                            for (var x = 0; x < howMCount; x++){
                                tagListCounted.push(tagList[i]);
                            }
                        }
                        
                        for (var i = 0; i < bodyLenth; i++) {
                            if (isMultiSubset(tagListCounted, body.Items[i].tags)){
                                links.push(body.Items[i].s3_url)
                            }
                        }
                        body = links;
                    }
                }
              break;
           case 'POST':
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
   return {statusCode, body, headers,};
};