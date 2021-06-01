import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import cdk = require("@aws-cdk/core");

export class SaleNotifierStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const lambdaFn = new lambda.Function(this, "SaleNotifierHandler", {
      code: lambda.Code.fromAsset("lambda"),
      handler: "sale-notifier.handler",
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // Run every day at 6PM UTC
    // See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
    const rule = new events.Rule(this, "Rule", {
      schedule: events.Schedule.expression("cron(0 18 ? * MON-FRI *)"), //todo change this
    });

    rule.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}

const app = new cdk.App();
new SaleNotifierStack(app, "SaleNotifierApp");
app.synth();
