# event-bridge-demo

Demo of Amazon [EventBridge](https://aws.amazon.com/eventbridge/), a serverless event bus that connects AWS services, 3rd party SaaS applications, and your own custom applications.

![event bridge diagram](https://d1rh7w878b62nu.cloudfront.net/554bad78742e3187ac541d43ef396c5e6221b1a4/images/product-page-diagram_EventBridge_How-it-works.png)

## Using the AWS CLI

Using the AWS CLI, you can create simple Hello, World example to see how this works, and see how the events propagate.  

Create an event bus with a rule that triggers a lambda function that logs the event.  Then when you put the event on the bus, you can see the Hello, World message gets logged.

*Note: Replace `${REGION}` with your preferred region and `${ACCOUNT}` with your account number.*

```bash
# create an event bus

aws events create-event-bus \
    --name "event-bridge-demo"

# create a lambda function to invoke

aws iam create-role \
    --role-name "lambda-cli-role" \
    --assume-role-policy-document "file://cli/policy.json"

aws iam attach-role-policy \
    --role-name "lambda-cli-role" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

zip -j "function.zip" "./backend/index.js"

aws lambda create-function \
    --function-name "event-logger" \
    --zip-file "fileb://function.zip" \
    --handler "index.handler" \
    --runtime "nodejs10.x" \
    --role "arn:aws:iam::${ACCOUNT}:role/lambda-cli-role"

# create a rule with lambda function as the target

aws events put-rule \
    --name "log-event" \
    --event-bus-name "event-bridge-demo" \
    --event-pattern "file://cli/pattern.json"

aws events put-targets \
    --event-bus-name "event-bridge-demo" \
    --rule "log-event" \
    --targets "[{\"Id\":\"1\",\"Arn\":\"arn:aws:lambda:${REGION}:${ACCOUNT}:function:event-logger\"}]"

aws lambda add-permission \
    --function-name "event-logger" \
    --statement-id "log-event" \
    --action "lambda:InvokeFunction" \
    --principal "events.amazonaws.com" \
    --source-arn "arn:aws:events:${REGION}:${ACCOUNT}:rule/event-bridge-demo/log-event"

# test the event patterns

aws events test-event-pattern \
    --event-pattern "file://cli/pattern.json" \
    --event "file://cli/events/hello.json"

aws events test-event-pattern \
    --event-pattern "file://cli/pattern.json" \
    --event "file://cli/events/wrong_source.json"

# send events to your bus

aws events put-events \
    --entries "file://cli/entries.json"
```

Now you can log into the [AWS console](https://console.aws.amazon.com) to view your resources and event logs.

## Using the AWS Console

View the rules the you created in the custom event bus:

https://console.aws.amazon.com/events/home#/eventbus/event-bridge-demo/rules/log-event

Click "Metrics for the rule" to view the graph.  You should see a successul invocation.

You can view the created lambda function:

https://console.aws.amazon.com/lambda/home#/functions/event-logger

And you should be able to find the event logged in the lambda function's cloud watch logs:

https://console.aws.amazon.com/cloudwatch/home#logEventViewer:group=/aws/lambda/event-logger

## Cleaning Up

To clean up the resources, you can use these commands:

```bash
aws lambda remove-permission \
    --function-name "event-logger" \
    --statement-id "log-event"

aws events remove-targets \
    --event-bus-name "event-bridge-demo" \
    --rule "log-event" \
    --ids "1"

aws events delete-rule \
    --name "log-event" \
    --event-bus-name "event-bridge-demo"

aws lambda delete-function \
    --function-name "event-logger"

aws iam detach-role-policy \
    --role-name "lambda-cli-role" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

aws iam delete-role \
    --role-name "lambda-cli-role"

aws events delete-event-bus \
    --name "event-bridge-demo"
```

## CloudFormation / CDK

