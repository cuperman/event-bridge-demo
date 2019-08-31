import path = require('path');
import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { Rule } from '@aws-cdk/aws-events';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';

export interface EventBridgeDemoStackProps extends StackProps {
  readonly eventSource: string;
}

export class EventBridgeDemoStack extends Stack {
  constructor(scope: Construct, id: string, props: EventBridgeDemoStackProps) {
    super(scope, id, props);

    const { eventSource } = props;

    const eventLogger = new Function(this, 'EventLoggerFunction', {
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, '../../backend'))
    });

    new Rule(this, 'LogEventRule', {
      eventPattern: {
        source: [eventSource]
      },
      targets: [new LambdaFunction(eventLogger)]
    });
  }
}
