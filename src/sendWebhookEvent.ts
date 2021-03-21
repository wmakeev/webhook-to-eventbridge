import type { APIGatewayProxyEvent } from 'aws-lambda'
import querystring from 'querystring'

interface INotificationRepository {
  send: (message: Object) => Promise<any>
}

/**
 * The event we are sending to the EventBridge event bus is similar to
 * APIGatewayProxyEventWithoutBody, body can be string, null or object.
 *
 * This is because we are parsing the request body if the request content type
 * is application/json or application/x-www-form-urlencoded.
 *
 * We are also reusing the APIGatewayProxyEvent interface, but we need to remove
 * body property
 *
 * And then extend the interface with a new type for a body property
 **/
interface IEvent extends Omit<APIGatewayProxyEvent, 'body'> {
  body?:
    | string
    | null
    | {
        [key: string]: any
      }
}

export async function sendWebhookEvent(
  event: APIGatewayProxyEvent,
  notification: INotificationRepository
) {
  const eventCopy: IEvent = Object.assign({}, event)

  let body = event.body

  const contentType =
    eventCopy.headers['Content-Type'] || eventCopy.headers['content-type']

  if (body) {
    if (event.isBase64Encoded) {
      body = Buffer.from(body, 'base64').toString('utf8')
    }

    if (contentType) {
      if (/^application\/json($|;)/.test(contentType)) {
        eventCopy.body = JSON.parse(body)
      } else if (/^application\/x-www-form-urlencoded($|;)/.test(contentType)) {
        eventCopy.body = querystring.parse(body)
      }
    }
  }

  return await notification.send(eventCopy)
}
