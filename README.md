# sale-notifier
AWS lambda function scheduled using eventbridge to scan certain pages and send an email with SES if a sale is identified



## Local deving

Test publishing a message

```
aws sns publish \
    --subject "My Subject 🚀" \
    --message "Hello world 🐊" \
    --topic-arn "arn:aws:sns:us-east-1:424795685451:saleTopic"

```


Test lambda code

```
node ./lambda/my-lambda.js

```

Get lambda config/env varibales

```
aws lambda get-function-configuration --function-name
```