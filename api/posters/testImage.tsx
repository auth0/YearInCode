import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import chromium from 'chrome-aws-lambda'
import {APIGatewayProxyEvent} from 'aws-lambda'
import AWS from 'aws-sdk'

import PosterSVG from '@web/components/poster/Poster/PosterSvg'
import {getMockData} from '@web/components/poster/Poster/Poster.utils'
import {logger} from '@nebula/log'

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
    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>This is a screenshot!</h1>
        ${ReactDOMServer.renderToString(
          <PosterSVG data={getMockData()} width={300} height={300} />,
        )}
      </body>
    </html>  
  `

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

    logger.info('Starting screenshot generation...')
    const screenshot = await page.screenshot()
    logger.info(`Finished generating screenshot! Result: ${screenshot}`)

    logger.info('Cleaning up...')
    await browser.close()

    const res = await S3.putObject({
      Bucket: process.env.POSTER_BUCKET,
      Key: Math.ceil(Math.random() * 8000).toString(),
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
