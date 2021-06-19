import AWS = require("aws-sdk");
import { SNSEvent } from "aws-lambda";

// Set the region
AWS.config.region = process.env.AWS_REGION;

const ses = new AWS.SES();

//Get Email Addresses
const senderEmailAddress = process.env.SES_SENDER_IDENTITY;
const receiverEmailAddress = process.env.SES_RECEIVER_IDENTITY;

exports.handler = async function (event: SNSEvent) {
  console.warn("Notifying sale")
  console.log("Received event" + event);

  const records = event.Records.map((record: any) => {
    const { Message, Subject } = record.Sns;

    return { subject: Subject, message: Message };
  });

  console.log("records: 👉", JSON.stringify(records, null, 2));

  const subject = event.Records[0].Sns.Subject;
  const saleUrl = event.Records[0].Sns.Message;

  const params = {
    Destination: {
      ToAddresses: [receiverEmailAddress /* RECEIVER email address */],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            subject + ": " + saleUrl /* customize html version of email body */,
        },
        Text: {
          Charset: "UTF-8",
          Data:
            subject + ": " + saleUrl /* customize text version of email body */,
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
  const result = await ses
    .sendEmail(params as AWS.SES.SendEmailRequest)
    .promise();
    
  console.log(result);

  return {
    statusCode: 200,
  };
}
