import { Stack, Construct, StackProps, CfnResource } from '@aws-cdk/core';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CfnResource(this, 'MyEventRule', {
      type: 'AWS::Events::Rule',
      properties: {
        Description: '',
        EventPattern: JSON.stringify({}),
        Name: '',
        RoleArn: '',
        ScheduleExpression: '',
        State: '',
        Targets: []
      }
    })
  }
}
