#!/usr/bin/env node

import { App } from '@aws-cdk/core'
import { PipelineStack } from '../lib/PipelineStack'

const { CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT } = process.env

const app = new App()

const APP_NAME = 'WebhookToEventBridge'

const APP_DESCRIPTION =
  'Accepts webhooks from api endpoint and sends it to webhook event bus'

const createStack = (app: App, stage: 'Prod' | 'Stage') => {
  new PipelineStack(app, `${stage}-${APP_NAME}CI`, {
    env: {
      account: CDK_DEFAULT_ACCOUNT,
      region: CDK_DEFAULT_REGION
    },

    app: {
      name: APP_NAME,
      description: APP_DESCRIPTION
    },

    stage,

    repositoryBranch: stage === 'Prod' ? 'master' : 'stage',

    eventBusName: stage === 'Prod' ? 'webhook' : 'webhook.stage'
  })
}

createStack(app, 'Prod')

// createStack(app, 'Stage')

app.synth()
