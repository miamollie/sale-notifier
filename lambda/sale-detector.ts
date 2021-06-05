import { publishMessage, params } from "../util/publishMessage";

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
