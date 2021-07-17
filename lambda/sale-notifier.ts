import { SNSEvent } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

//Get Email Addresses
const SenderEmailAddress = process.env.SES_SENDER_IDENTITY;
const ReceiverEmailAddress = process.env.SES_RECEIVER_IDENTITY;
const CHARSET = "UTF-8";
exports.handler = async function (event: SNSEvent) {
  console.warn("Notifying sale");

  const subject = event.Records[0].Sns.Subject;
  const saleUrl = event.Records[0].Sns.Message;

  await sendEmail(subject, saleUrl);
  return {
    statusCode: 200,
  };
};

async function sendEmail(subject: string, saleUrl: string) {
  const recipient =
    typeof ReceiverEmailAddress === "string" ? ReceiverEmailAddress : "error";
  const sender =
    typeof SenderEmailAddress === "string" ? SenderEmailAddress : "error";
  const params = {
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Html: {
          Charset: CHARSET,
          /*  html version of email body */
          Data: subject + ": " + saleUrl,
        },
        Text: {
          Charset: CHARSET,
          /*  text version of email body */
          Data: subject + ": " + saleUrl,
        },
      },
      Subject: {
        Charset: CHARSET,
        Data: "New item on sale",
      },
    },
    /* required: verified Amazon SES identity FROM email address */
    Source: sender,
    /* verified Amazon SES identity FROM email address */
    ReplyToAddresses: [sender],
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
    return;
  }
}
