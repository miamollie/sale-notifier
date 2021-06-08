import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");
import * as sns from "@aws-cdk/aws-sns";
import * as subs from "@aws-cdk/aws-sns-subscriptions";
import iam = require("@aws-cdk/aws-iam");
import { Effect } from "@aws-cdk/aws-iam";

export class SaleNotifierStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const saleDetectionFn = new lambda.Function(this, "SaleDetectionHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "sale-detector.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const saleNotifierFn = new lambda.Function(this, "SaleNotifierHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "sale-notifier.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const iAmStatement = new iam.PolicyStatement({
      effect: Effect.ALLOW,
    });
    iAmStatement.addActions("ses:SendEmail");
    iAmStatement.addResources("*");
    saleNotifierFn.addToRolePolicy(iAmStatement);

    const topic = new sns.Topic(this, "Sale", {
      displayName: "New sale topic",
      topicName: "saleTopic",
    });

    topic.addSubscription(new subs.LambdaSubscription(saleNotifierFn));

    const rule = new events.Rule(this, "Rule", {
      schedule: events.Schedule.rate(cdk.Duration.days(1)),
    });

    rule.addTarget(new targets.LambdaFunction(saleDetectionFn));
  }
}

const app = new cdk.App();
new SaleNotifierStack(app, "SaleNotifierApp");
app.synth();
