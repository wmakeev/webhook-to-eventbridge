import { Construct, Stage, StageProps } from '@aws-cdk/core'
import { PipelineStack } from './PipelineStack'

export interface PipelineStageProps extends StageProps {
  app: {
    name: string
    description: string
  }

  repositoryBranch: string

  eventBusName: string
}

export class PipelineStage extends Stage {
  constructor(
    scope: Construct,
    id: 'Prod' | 'Stage',
    props: PipelineStageProps
  ) {
    super(scope, id, props)

    new PipelineStack(this, `${props.app.name}CI`, {
      app: props.app,

      stage: id,

      repository: {
        name: `${props.app.name}Stack`,
        branch: props.repositoryBranch
      },

      eventBusName: props.eventBusName
    })
  }
}
