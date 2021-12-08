import { Code, Runtime, Function } from '@aws-cdk/aws-lambda'
import { EventBus } from '@aws-cdk/aws-events'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import {
  Stack,
  Construct,
  StackProps,
  Duration,
  CfnOutput
} from '@aws-cdk/core'

export interface WebhookToEventBridgeStackProps extends StackProps {
  eventBusName: string
}

export class WebhookToEventBridgeStack extends Stack {
  public static appName = 'WebhookToEventBridge'

  public readonly endpointUrlOutput: CfnOutput

  constructor(
    scope: Construct,
    id: string,
    props: WebhookToEventBridgeStackProps
  ) {
    super(scope, id, props)

    const handlerLambda = new Function(this, 'HandlerLambda', {
      code: Code.fromAsset('./src'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
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
