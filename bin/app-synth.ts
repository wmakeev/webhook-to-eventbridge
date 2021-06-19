#!/usr/bin/env node

import 'source-map-support/register'

import { App } from '@aws-cdk/core'
import { PipelineStack } from '../lib/PipelineStack'
import { AppStage } from '../lib/AppStage'

const { CDK_DEFAULT_REGION, CDK_DEFAULT_ACCOUNT } = process.env

const app = new App()

const APP_NAME = AppStage.appName

new PipelineStack(app, `${APP_NAME}-deploy`, {
  env: {
    account: CDK_DEFAULT_ACCOUNT,
    region: CDK_DEFAULT_REGION
  },
  repositoryName: APP_NAME,
  appStageFactories: [
    scope => new AppStage(scope, 'prod', { eventBusName: 'webhook' })
  ]
})

app.synth()
