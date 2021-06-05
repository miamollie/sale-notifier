import AWS = require("aws-sdk");
// Set the region
AWS.config.region = process.env.AWS_REGION;

const ses = new AWS.SES();

//Get Email Addresses
const senderEmailAddress = process.env.SES_SENDER_IDENTITY; //TODO set this
const receiverEmailAddress = process.env.SES_RECEIVER_IDENTITY; //TODO set this

exports.handler = async function (event: { saleURL: string }) {
  var params = {
    Destination: {
      ToAddresses: [receiverEmailAddress /* RECEIVER email address */],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            "Found item on sale" +
            event.saleURL /* customize html version of email body */,
        },
        Text: {
          Charset: "UTF-8",
          Data:
            "Found item on sale" +
            event.saleURL /* customize text version of email body */,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New item on sale",
      },
    },
    Source:
      senderEmailAddress /* required: verified Amazon SES identity FROM email address */,
    ReplyToAddresses: [
      senderEmailAddress /* verified Amazon SES identity FROM email address */,
    ],
  };
  // Send to SES
  const result = await ses.sendEmail(params).promise();
  console.log(result);
};
