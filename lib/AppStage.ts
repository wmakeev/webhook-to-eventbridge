import { CfnOutput, Construct, Stage } from '@aws-cdk/core'
import {
  WebhookToEventBridgeStack,
  WebhookToEventBridgeStackProps
} from './AppStack'

export class AppStage extends Stage {
  public readonly endpointUrlOutput: CfnOutput
  public static appName = WebhookToEventBridgeStack.appName

  constructor(
    scope: Construct,
    id: string,
    props: WebhookToEventBridgeStackProps
  ) {
    super(scope, id, props)

    const stack = new WebhookToEventBridgeStack(
      this,
      WebhookToEventBridgeStack.appName,
      props
    )

    this.endpointUrlOutput = stack.endpointUrlOutput
  }
}
