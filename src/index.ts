import type { APIGatewayProxyHandler } from 'aws-lambda'
import { EventBridgeRepository } from './EventBridgeRepository'
import { sendWebhookEvent } from './sendWebhookEvent'

const { EVENT_BUS_NAME } = process.env

export const handler: APIGatewayProxyHandler = async event => {
  console.log('event: ', JSON.stringify(event))

  try {
    if (!EVENT_BUS_NAME) {
      throw new Error('Environment variable EVENT_BUS_NAME not defined')
    }

    const path: string | null = event.path?.split('/')?.[1] ?? null

    const eventSource = path

    if (!eventSource) {
      throw new Error('Event source should be specified in webhook path')
    }

    const notification = new EventBridgeRepository(EVENT_BUS_NAME, eventSource)

    await sendWebhookEvent(event, notification)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: true
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: false,
        message: err.message
      })
    }
  }
}
