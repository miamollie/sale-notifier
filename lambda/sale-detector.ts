import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import axios from "axios";
import cheerio from "cheerio";

const dbClient = new DynamoDBClient({ region: "us-east-1" });
const snsClient = new SNSClient({ region: "us-east-1" });

exports.handler = async function () {
  console.log("Checking for sale...");
  const Items = await getItemData();

  Items.forEach(async function (element) {
    console.log(element);
    console.log(element.url);
    const { url } = element as unknown as SaleItemType; //TODO fix types
    const foundSale = await detectSale(element as unknown as SaleItemType);
    console.log(`Found sale: ${foundSale}`);

    if (foundSale) {
      await publishMessage(url);
    }
  });

  return { statusCode: 200 };
};

const command = new ScanCommand({ TableName: process.env.TABLE_NAME! });

async function getItemData(): Promise<SaleItemType[]> {
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
    console.log("Caught error in getItemData");
    console.log(error);
    return [];
  }
}

interface SaleItemType {
  url: string;
  sale_identifier: string;
}

async function detectSale(data: SaleItemType) {
  try {
    const response = await axios(data.url);
    if (!response) {
      console.log("No response from URL");
      return { statusCode: 500 };
    }
    const $ = cheerio.load(response.data);

    const node = $(data.sale_identifier);
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
