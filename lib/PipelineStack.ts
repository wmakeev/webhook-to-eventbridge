import { Stack, StackProps, Construct, Stage } from '@aws-cdk/core'
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines'
import { Artifact } from '@aws-cdk/aws-codepipeline'
import { Repository } from '@aws-cdk/aws-codecommit'
import { CodeCommitSourceAction } from '@aws-cdk/aws-codepipeline-actions'
import { LinuxBuildImage } from '@aws-cdk/aws-codebuild'

export interface PipelineStackProps extends StackProps {
  repositoryName: string
  appStageFactories: Array<(scope: Stack) => Stage>
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props)

    const sourceArtifact = new Artifact()

    const cloudAssemblyArtifact = new Artifact()

    const codeCommitRepository = Repository.fromRepositoryName(
      this,
      'CodeCommitRepository',
      props.repositoryName
    )

    const sourceAction = new CodeCommitSourceAction({
      actionName: 'CodeCommitSourceAction',
      repository: codeCommitRepository,
      branch: 'master',
      output: sourceArtifact
    })

    const synthAction = SimpleSynthAction.standardNpmSynth({
      sourceArtifact,

      environment: {
        // node v14.15.4, npm v6.14.10
        buildImage: LinuxBuildImage.STANDARD_5_0
      },

      cloudAssemblyArtifact,

      installCommand: ['node -v', 'npm -v', 'npm install'].join(' && '),

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

    props.appStageFactories.forEach(factory => {
      pipeline.addApplicationStage(factory(this))
    })
  }
}
