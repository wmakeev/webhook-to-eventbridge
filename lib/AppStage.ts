import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core'
import { AppStack } from './AppStack'

export interface AppStageProps extends StageProps {
  app: {
    name: string
    description: string
  }
  eventBusName: string
}

export class AppStage extends Stage {
  public readonly endpointUrlOutput: CfnOutput

  constructor(scope: Construct, id: 'Prod' | 'Stage', props: AppStageProps) {
    super(scope, id, props)

    const stack = new AppStack(this, `${props.app.name}Stack`, {
      description: props.app.description,
      stage: id,
      eventBusName: props.eventBusName
    })

    this.endpointUrlOutput = stack.endpointUrlOutput
  }
}
