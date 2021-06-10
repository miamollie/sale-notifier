import AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");
// Set region
AWS.config.region = process.env.AWS_REGION;

// Create publish parameters
const params = {
  Message: "something to do with the sale URL?" /* required */,
  TopicArn: "arn:aws:sns:us-east-1:424795685451:saleTopic",
  Subject: "New sale detected",
};

// Create promise and SNS service object
const publishMessage = new AWS.SNS().publish(params).promise();
const SALE_URL =
  "https://www.lululemon.com.au/en-au/p/free-to-be-serene-bra-light-support%2C-c%2Fd-cup/prod8430423.html";
const SALE_IDENTIFIER = ".cta-price-value .list-price";

exports.handler = async function () {
  console.log("Checking for sale");
  const foundSale = await detectSale(SALE_URL);

  if (foundSale) {
    publishMessage
      .then(function () {
        console.log(
          `Message ${params.Message} sent to the topic ${params.TopicArn}`
        );
      })
      .catch(function (err: any) {
        console.error(err, err.stack);
      });
  }

  return { statusCode: 200 };
};

async function detectSale(url: string) {
  const response = await axios(url).catch((e: Error) => console.log(e));
  const html = response.data;
  const $ = cheerio.load(html);
  const salePriceFound = $(SALE_IDENTIFIER);
  console.log("Sale:" + !!salePriceFound);
  return !!salePriceFound;
}
