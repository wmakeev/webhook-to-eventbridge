import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { EventBus } from '@aws-cdk/aws-events'
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda'
import {
  CfnOutput,
  Construct,
  Duration,
  Stack,
  StackProps
} from '@aws-cdk/core'

export interface AppStackProps extends StackProps {
  stage: 'Prod' | 'Stage'
  eventBusName: string
}

export class AppStack extends Stack {
  public readonly endpointUrlOutput: CfnOutput

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props)

    const handlerLambda = new Function(this, 'HandlerLambda', {
      code: Code.fromAsset('./src'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        NODE_ENV: props.stage === 'Prod' ? 'production' : 'staging',
        NODE_OPTIONS: '--enable-source-maps',
        EVENT_BUS_NAME: props.eventBusName
      },
      description: `Webhook handler (event bus - ${props.eventBusName})`
    })

    EventBus.grantAllPutEvents(handlerLambda)

    const lambdaRestApi = new LambdaRestApi(this, 'Endpoint', {
      handler: handlerLambda
    })

    this.endpointUrlOutput = new CfnOutput(this, 'WebhookEndpoint', {
      value: lambdaRestApi.url
    })
  }
}
