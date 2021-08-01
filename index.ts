import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import cdk = require("@aws-cdk/core");
import * as sns from "@aws-cdk/aws-sns";
import * as subs from "@aws-cdk/aws-sns-subscriptions";
import iam = require("@aws-cdk/aws-iam");
import { Effect } from "@aws-cdk/aws-iam";
export class SaleNotifierStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const table = new dynamodb.Table(this, "SaleItem", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });


    //Create detection lambda
    const saleDetectionFn = new lambda.Function(this, "SaleDetectionHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "sale-detector.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    table.grantFullAccess(saleDetectionFn);

    //Create notification lambda
    const saleNotifierFn = new lambda.Function(this, "SaleNotifierHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "sale-notifier.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    //Grant notifier lambda permission to send email
    const iAmStatementNotifier = new iam.PolicyStatement({
      effect: Effect.ALLOW,
    });
    iAmStatementNotifier.addActions("ses:SendEmail");
    iAmStatementNotifier.addResources("*");
    saleNotifierFn.addToRolePolicy(iAmStatementNotifier);

    //Create pub/sub notification topic
    const topic = new sns.Topic(this, "Sale", {
      displayName: "New sale topic",
      topicName: "saleTopic",
    });

    //Subscribe the notification lambda to the pub/sub rule
    topic.addSubscription(new subs.LambdaSubscription(saleNotifierFn));
    topic.grantPublish(saleDetectionFn);

    //Create scheduled event
    const rule = new events.Rule(this, "Rule", {
      schedule: events.Schedule.rate(cdk.Duration.days(1)),
    });

    //Add the sale detection lambda to the scheduled event
    rule.addTarget(new targets.LambdaFunction(saleDetectionFn));
  }
}

const app = new cdk.App();
new SaleNotifierStack(app, "SaleNotifierApp");
app.synth();
