import AWS = require("aws-sdk");
// Set region
AWS.config.region = process.env.AWS_REGION; //todo where should I really set this...

// Create publish parameters
export const params = {
  Message: "something to do with the sale URL?" /* required */,
  TopicArn: "arn:aws:sns:us-east-1:424795685451:saleTopic",
};

// Create promise and SNS service object
export const publishMessage = new AWS.SNS().publish(params).promise();

exports.handler = async function () {
  // Handle promise's fulfilled/rejected states
  publishMessage
    .then(function (data: any) {
      console.log(
        `Message ${params.Message} sent to the topic ${params.TopicArn}`
      );
      console.log("MessageID is " + data.MessageId);
    })
    .catch(function (err: any) {
      console.error(err, err.stack);
    });
};
