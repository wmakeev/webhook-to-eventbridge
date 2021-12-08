#!/usr/bin/env node

import { App } from '@aws-cdk/core'
import { PipelineStage } from '../lib/PipelineStage'

const { CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT } = process.env

const app = new App()

const APP_NAME = 'WebhookToEventBridge'

const APP_DESCRIPTION =
  'Accepts webhooks from api endpoint and sends it to webhook event bus'

new PipelineStage(app, 'Prod', {
  env: {
    account: CDK_DEFAULT_ACCOUNT,
    region: CDK_DEFAULT_REGION
  },

  app: {
    name: APP_NAME,
    description: APP_DESCRIPTION
  },

  repositoryBranch: 'master',

  eventBusName: 'webhook'
})

app.synth()
