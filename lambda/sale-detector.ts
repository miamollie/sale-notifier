import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: "us-east-1" });

const axios = require("axios");
const cheerio = require("cheerio");

// Create publish parameters
const params = {
  TopicArn: process.env.SALE_TOPIC_ARN,
  Subject: "New sale detected",
  Message: "",
};

const SALE_URL =
  "https://www.lululemon.com.au/en-au/p/free-to-be-serene-bra-light-support%2C-c%2Fd-cup/prod8430423.html";
const SALE_IDENTIFIER = ".cta-price-value .list-price";

exports.handler = async function () {
  console.log("Checking for sale...");
  const foundSale = await detectSale(SALE_URL);
  console.log(`Found sale: ${foundSale}`);

  if (foundSale) {
    await publishMessage(SALE_URL);
  }

  return { statusCode: 200 };
};

async function detectSale(url: string) {
  const response = await axios(url).catch((e: Error) =>
    console.log(`Error requesting sale url: ${e}`)
  );

  const $ = cheerio.load(response.data);

  const node = $(SALE_IDENTIFIER);
  return node.length > 0;
}

async function publishMessage(url: string) {
  try {
    const data = await snsClient.send(
      new PublishCommand({ ...params, Message: url })
    );
    console.log("Success.", data);
    return data;
  } catch (err) {
    console.log("Error", err.stack);
    return;
  }
}
