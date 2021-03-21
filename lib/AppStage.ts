import { CfnOutput, Construct, Stage } from '@aws-cdk/core'
import {
  WebhookToEventbrigeStack,
  WebhookToEventbrigeStackProps
} from './AppStack'

export class AppStage extends Stage {
  public readonly endpointUrlOutput: CfnOutput
  public static appName = WebhookToEventbrigeStack.appName

  constructor(
    scope: Construct,
    id: string,
    props: WebhookToEventbrigeStackProps
  ) {
    super(scope, id, props)

    const stack = new WebhookToEventbrigeStack(
      this,
      WebhookToEventbrigeStack.appName,
      props
    )

    this.endpointUrlOutput = stack.endpointUrlOutput
  }
}
