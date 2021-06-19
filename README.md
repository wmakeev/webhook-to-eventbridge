# Webhook to EventBrige (AWS CDK Stack)

> Based on [generic-webhook-to-eventbridge](https://github.com/vacationtracker/generic-webhook-to-eventbridge)

## Deploy

1. Fork and pull GitHub repository

2. Create CodeCommit `webhook-to-eventbrige` repository

3. Add CodeCommit repository to origin

4. (optional) Update CDK to latest version

5. Push to CodeCommit repository on branch `master`

6. Deploy

```sh
PROFILE=[AWS config profile] npm run cdk:deploy
```

7. Crete event bus `webhook`

## Handle webhook events

1. Create simple "echo" Lambda

```js
exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2))
}
```

2. Create EventBrige rule for "webhook" event bus

- Rule name: `webhook-echo`

- Event pattern:

  ```json
  {
    "source": ["webhook"]
  }
  ```

- Target: Lambda "echo"

3. Post event

- Get webhook url from CloudFormation Stack outputs

  `https://[domainPrefix].execute-api.eu-west-1.amazonaws.com/prod/`

- Post json event

  ```json
  { "foo": "bar" }
  ```

  to url

  `https://[domainPrefix].execute-api.eu-west-1.amazonaws.com/prod/echo`

  `echo` string in url path will be passed to `detail-type` field in result event.

  You should get response with code `200` and json body:

  ```json
  { "ok": true }
  ```

- View "echo" Lambda output

  ```json
  {
    "version": "0",
    "id": "a181422e-596a-dadd-76d8-35b9e184c24b",
    "detail-type": "echo",
    "source": "webhook",
    "account": "912345678123",
    "time": "2021-06-19T09:23:20Z",
    "region": "eu-west-1",
    "resources": [],
    "detail": {
      "resource": "/{proxy+}",
      "path": "/echo",
      "httpMethod": "POST",
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "RU",
        "Content-Type": "application/json",
        "Host": "abcdefghjk.execute-api.eu-west-1.amazonaws.com",
        "Postman-Token": "142aa722-268f-4ddd-7534-5a350b2035b6",
        "User-Agent": "PostmanRuntime/7.28.0",
        "Via": "1.1 f625bdda16d203019232a5961e949d9fa.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "dyxyizPrwiZ8p1FlnAs_tLupncMdNtO_gJCg1iJXhIhPI4_hool0Lg==",
        "X-Amzn-Trace-Id": "Root=1-60cdb787-7fc47b73710907f82267811b",
        "X-Forwarded-For": "123.12.34.56, 23.10.10.10",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      "multiValueHeaders": {
        "Accept": ["*/*"],
        "Accept-Encoding": ["gzip, deflate, br"],
        "Cache-Control": ["no-cache"],
        "CloudFront-Forwarded-Proto": ["https"],
        "CloudFront-Is-Desktop-Viewer": ["true"],
        "CloudFront-Is-Mobile-Viewer": ["false"],
        "CloudFront-Is-SmartTV-Viewer": ["false"],
        "CloudFront-Is-Tablet-Viewer": ["false"],
        "CloudFront-Viewer-Country": ["RU"],
        "Content-Type": ["application/json"],
        "Host": ["abcdefghjk.execute-api.eu-west-1.amazonaws.com"],
        "Postman-Token": ["142aa722-268f-4ddd-7534-5a350b2035b6"],
        "User-Agent": ["PostmanRuntime/7.28.0"],
        "Via": [
          "1.1 f625bdda16d203019232a5961e949d9fa.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
          "dyxyizPrwiZ8p1FlnAs_tLupncMdNtO_gJCg1iJXhIhPI4_hool0Lg=="
        ],
        "X-Amzn-Trace-Id": ["Root=1-05cdb787-7fc47b73714907f82267811b"],
        "X-Forwarded-For": ["123.12.34.56, 23.10.10.10"],
        "X-Forwarded-Port": ["443"],
        "X-Forwarded-Proto": ["https"]
      },
      "queryStringParameters": null,
      "multiValueQueryStringParameters": null,
      "pathParameters": {
        "proxy": "echo"
      },
      "stageVariables": null,
      "requestContext": {
        "resourceId": "89k10d",
        "resourcePath": "/{proxy+}",
        "httpMethod": "POST",
        "extendedRequestId": "CKgdNGN5DoEFseQ=",
        "requestTime": "19/Jun/2021:09:23:19 +0000",
        "path": "/prod/echo",
        "accountId": "912345678123",
        "protocol": "HTTP/1.1",
        "stage": "prod",
        "domainPrefix": "abcdefghjk",
        "requestTimeEpoch": 1624094599572,
        "requestId": "f86a9370-53df-40ae-5955-463db4c40e6d",
        "identity": {
          "cognitoIdentityPoolId": null,
          "accountId": null,
          "cognitoIdentityId": null,
          "caller": null,
          "sourceIp": "123.12.34.56",
          "principalOrgId": null,
          "accessKey": null,
          "cognitoAuthenticationType": null,
          "cognitoAuthenticationProvider": null,
          "userArn": null,
          "userAgent": "PostmanRuntime/7.28.0",
          "user": null
        },
        "domainName": "abcdefghjk.execute-api.eu-west-1.amazonaws.com",
        "apiId": "abcdefghjk"
      },
      "body": {
        "foo": "bar"
      },
      "isBase64Encoded": false
    }
  }
  ```
