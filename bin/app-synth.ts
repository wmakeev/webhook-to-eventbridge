#!/usr/bin/env node

import 'source-map-support/register'

import { App } from '@aws-cdk/core'
import { PipelineStack } from '../lib/PipelineStack'
import { AppStage } from '../lib/AppStage'

const app = new App()

const APP_NAME = AppStage.appName

new PipelineStack(app, `${APP_NAME}-deploy`, {
  env: {
    account: '910985846600',
    region: 'eu-west-1'
  },
  repositoryName: APP_NAME,
  npmTokenSsmParamName: '/vensi/npm_token',
  appStageFactories: [
    scope => new AppStage(scope, 'vensi', { eventBusName: 'vensi' })
  ]
})

app.synth()
