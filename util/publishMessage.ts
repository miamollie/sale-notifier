import AWS = require("aws-sdk");
// Set region
AWS.config.region = process.env.AWS_REGION; //todo where should I really set this...

// Create publish parameters
export const params = {
  Message: "something to do with the sale URL?" /* required */,
  TopicArn: "TOPIC_ARN",
};

// Create promise and SNS service object
export const publishMessage = new AWS.SNS().publish(params).promise();
