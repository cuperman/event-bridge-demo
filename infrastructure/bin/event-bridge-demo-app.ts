#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { EventBridgeDemoStack } from '../lib/event-bridge-demo-stack';

const app = new cdk.App();
new EventBridgeDemoStack(app, 'EventBridgeDemoStack', {
  eventSource: 'myapp.acme.com'
});
