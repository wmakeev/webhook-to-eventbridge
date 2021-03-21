import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { EventBridgeRepository } from './EventBridgeRepository'
import { sendWebhookEvent } from './sendWebhookEvent'

const { EVENT_BUS_NAME } = process.env

export async function handler(event: APIGatewayProxyEventV2) {
  console.log('event: ', JSON.stringify(event))

  if (!EVENT_BUS_NAME) {
    throw new Error('Environment variable EVENT_BUS_NAME not defined')
  }

  const path: string | null = event.rawPath?.split('/')?.[0] ?? null

  const eventSource = path

  if (!eventSource) {
    throw new Error('Event source should be specified in webhook path')
  }

  const notification = new EventBridgeRepository(EVENT_BUS_NAME, eventSource)

  await sendWebhookEvent(event, notification)

  return {
    statusCode: 200,
    body: undefined
  }
}
