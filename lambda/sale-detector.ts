import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";
import cheerio from "cheerio";

const dbClient = new DynamoDBClient({ region: "us-east-1" });
const snsClient = new SNSClient({ region: "us-east-1" });

exports.handler = async function () {
  const Items = await lookupItems();

  const foundSale = await detectSale(Items[0]);
  console.log(`Found sale: ${foundSale}`);

  if (foundSale) {
    await publishMessage(Items[0].url.S);
  }

  return { statusCode: 200 };
};

const command = new ScanCommand({ TableName: process.env.TABLE_NAME! });
async function lookupItems(): Promise<SaleItemType[]> {
  try {
    const data = await dbClient.send(command);

    if (!data) {
      console.log("No data found");
      return [];
    }
    const { Items } = data;

    if (!Items) {
      console.log("No Items found");
      return [];
    }
    return Items as unknown as SaleItemType[];
  } catch (error) {
    console.log("Caught error in lookupItems");
    console.log(error);
    return [];
  }
}

interface SaleItemType {
  url: { S: string };
  sale_identifier: { S: string };
}

async function requestUrl(url: string): Promise<any> {
  try {
    console.log(`Requesting data at ${url}`);
    return await axios(url);
  } catch (e) {
    console.log(`Error requesting sale url: ${e}`);
    return;
  }
}

async function detectSale({ url, sale_identifier }: SaleItemType) {
  try {
    const response = await requestUrl(url.S);
    console.log(`Request to URl resulted in ${response.status}`);
    if (response.status !== 200) {
      return false;
    }

    const $ = cheerio.load(response.data);
    const node = $(sale_identifier.S);

    console.log(
      `Found number of nodes: ${node.length} using identifier ${sale_identifier.S}`
    );
    return node.length > 0;
  } catch (e) {
    console.log(`Error requesting sale url: ${e}`);
    return { statusCode: 500 };
  }
}

// Create publish parameters
const params = {
  TopicArn: process.env.SALE_TOPIC_ARN,
  Subject: "New sale detected",
  Message: "",
};

async function publishMessage(url: string) {
  try {
    const data = await snsClient.send(
      new PublishCommand({ ...params, Message: url })
    );
    console.log("Success.", data);
    return data;
  } catch (err) {
    console.log("Error", err.stack);
    return { statusCode: 500 };
  }
}
