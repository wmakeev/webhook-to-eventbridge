import { LinuxBuildImage } from '@aws-cdk/aws-codebuild'
import { Repository } from '@aws-cdk/aws-codecommit'
import { Artifact } from '@aws-cdk/aws-codepipeline'
import { CodeCommitSourceAction } from '@aws-cdk/aws-codepipeline-actions'
import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines'
import { AppStage } from './AppStage'

export interface PipelineStackProps extends StackProps {
  app: {
    name: string
    description: string
  }

  stage: 'Prod' | 'Stage'

  repository: {
    name: string
    branch: string
  }

  eventBusName: string
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props)

    const sourceArtifact = new Artifact()

    const cloudAssemblyArtifact = new Artifact()

    const codeCommitRepository = Repository.fromRepositoryName(
      this,
      'CodeCommitRepository',
      props.repository.name
    )

    const sourceAction = new CodeCommitSourceAction({
      actionName: 'CodeCommitSourceAction',
      repository: codeCommitRepository,
      branch: props.repository.branch,
      output: sourceArtifact
    })

    const synthAction = SimpleSynthAction.standardNpmSynth({
      sourceArtifact,

      environment: {
        // node v14.15.4, npm v6.14.10
        buildImage: LinuxBuildImage.STANDARD_5_0
      },

      cloudAssemblyArtifact,

      installCommand: [
        'echo "Node.js $(node -v), NPM $(npm -v)"',
        'npm ci'
      ].join(' && '),

      // Use this if you need a build step (if you're not using ts-node
      // or if you have TypeScript Lambdas that need to be compiled).
      buildCommand: 'npm run build',

      synthCommand: 'npx cdk synth'
    })

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      cloudAssemblyArtifact,
      sourceAction,
      synthAction,
      crossAccountKeys: false
    })

    pipeline.addApplicationStage(
      new AppStage(this, props.stage, {
        app: props.app,
        eventBusName: props.eventBusName
      })
    )
  }
}
