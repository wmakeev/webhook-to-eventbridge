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

export interface WebhookToEventbrigeStackProps extends StackProps {
  eventBusName: string
}

export class WebhookToEventbrigeStack extends Stack {
  public static appName = 'webhook-to-eventbrige'

  public readonly endpointUrlOutput: CfnOutput

  constructor(
    scope: Construct,
    id: string,
    props: WebhookToEventbrigeStackProps
  ) {
    super(scope, id, props)

    const handlerLambda = new Function(this, 'handler-lambda', {
      code: Code.fromAsset('./src'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      environment: {
        EVENT_BUS_NAME: props.eventBusName
      },
      description: `Webhook handler (event bus - ${props.eventBusName})`
    })

    EventBus.grantAllPutEvents(handlerLambda)

    const lambdaRestApi = new LambdaRestApi(this, 'endpoint', {
      handler: handlerLambda
    })

    this.endpointUrlOutput = new CfnOutput(this, 'WebhookEndpoint', {
      value: lambdaRestApi.url
    })
  }
}
