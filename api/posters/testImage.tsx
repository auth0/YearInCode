import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import chromium from 'chrome-aws-lambda'
import {APIGatewayProxyEvent} from 'aws-lambda'
import AWS from 'aws-sdk'

import {getMockData} from '@web/components/poster/Poster/Poster.utils'
import {logger} from '@nebula/log'

import {InstagramPoster} from './components'

const S3 = new AWS.S3({
  ...(process.env.IS_OFFLINE && {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4569').href,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  }),
})

export async function testImage(event: APIGatewayProxyEvent) {
  try {
    logger.info('Generating poster...')
    const html = ReactDOMServer.renderToString(
      <InstagramPoster data={getMockData()} />,
    )

    logger.info('Starting browser...')
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    logger.info('Setting page content...')
    await page.setContent(html)
    await page.setViewport({width: 1080, height: 1080})

    logger.info('Starting screenshot generation...')
    const screenshot = await page.screenshot()
    logger.info(`Finished generating screenshot!`)

    logger.info('Cleaning up...')
    await browser.close()

    const res = await S3.putObject({
      Bucket: process.env.POSTER_BUCKET,
      Key: Math.ceil(Math.random() * 8000).toString() + '.png',
      Body: screenshot as any,
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify('Error: ' + e),
    }
  }
}
