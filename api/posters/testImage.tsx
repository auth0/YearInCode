import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import chromium from 'chrome-aws-lambda'
import {Browser} from 'puppeteer-core'

import PosterSvg from '@web/components/poster/Poster/PosterSVG'
import {getMockData} from '@web/components/poster/Poster/Poster.utils'

export async function testImage() {
  console.log('Generating poster...')
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <h1>This is a screenshot!</h1>
        ${ReactDOMServer.renderToString(
          <PosterSvg data={getMockData()} width={300} height={300} />,
        )}
      </body>
    </html>  
  `

  console.log('Starting browser...')
  const browser: Browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
  const page = await browser.newPage()

  console.log('Setting page content...')
  await page.setContent(html)

  console.log('Starting screenshot generation...')
  const screenshot = await page.screenshot()
  console.log(`Finished generating screenshot! Result: ${screenshot}`)

  console.log('Cleaning up...')
  await browser.close()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
    body: screenshot,
  }
}
