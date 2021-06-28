import AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
// Set region
AWS.config.region = process.env.AWS_REGION;

// Create publish parameters
const params = {
  TopicArn: "arn:aws:sns:us-east-1:424795685451:saleTopic",
  Subject: "New sale detected",
  Message: "",
};

const SALE_URL =
  "https://www.lululemon.com.au/en-au/p/free-to-be-serene-bra-light-support%2C-c%2Fd-cup/prod8430423.html";
const SALE_IDENTIFIER = ".cta-price-value .list-price";

exports.handler = async function () {
  console.log("Checking for sale...");
  const foundSale = await detectSale(SALE_URL);
  console.log(`Found sale: ${foundSale}`)
  const publishMessage = new AWS.SNS().publish({...params, Message: SALE_URL}).promise();

  if (foundSale) {
    console.log('Publishing event to topic')
    publishMessage
      .then(function () {
        console.log(
          `Message ${params.Message} sent to the topic ${params.TopicArn}`
        );
        return { statusCode: 200 };
      })
      .catch(function (err: any) {
        console.log(err, err.stack);
          return { statusCode: 500 };
      });
  }

  return { statusCode: 200 };
};

async function detectSale(url: string) {
  console.log("Request to URL started")
  const response = await axios(url).catch((e: Error) => console.log(`Error requesting sale url: ${e}`));
  console.log("Request to URL ended")
  
  const $ = cheerio.load(response.data);

  const node = $(SALE_IDENTIFIER);
  return node.length > 0;
}
