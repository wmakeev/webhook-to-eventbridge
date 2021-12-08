#!/usr/bin/env node

import { App } from '@aws-cdk/core'
import { PipelineStack } from '../lib/PipelineStack'
import { AppStage } from '../lib/AppStage'

const { CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT } = process.env

const app = new App()

const APP_NAME = AppStage.appName

new PipelineStack(app, `${APP_NAME}CI`, {
  env: {
    account: CDK_DEFAULT_ACCOUNT,
    region: CDK_DEFAULT_REGION
  },
  repositoryName: APP_NAME,
  description: `${APP_NAME} CI stack`,
  appStageFactories: [
    scope =>
      new AppStage(scope, 'Prod', {
        eventBusName: 'webhook',
        description:
          'Accepts webhooks from api endpoint and sends it to webhook event bus'
      })
  ]
})

app.synth()
