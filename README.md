# Webhook to EventBrige for AWS CDK

## Deploy

1. Add origin to CodeCommit repository and push

2. (optional) Update CDK to latest version

3. Push to CodeCommit repository to specific project origin

4. Deploy

```sh
PROFILE=[AWS config profile] cdk:deploy
```

## Inital

- Push initial commit

  ```
  git push --set-upstream origin master
  ```
