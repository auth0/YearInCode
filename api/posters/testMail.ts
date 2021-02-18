import createHttpError from 'http-errors'
import AWS from 'aws-sdk'

import {logger} from '@nebula/log'
console.log(process.env)
const SES = new AWS.SES({
  region: 'us-east-1',
  ...(process.env.IS_OFFLINE && {endpoint: 'http://localhost:9001'}),
})

export async function testMail() {
  try {
    const params: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: ['success@simulator.amazonses.com'],
      },
      Source: 'jfelix@stackbuilders.com',
      Message: {
        Subject: {
          Data: `[Name], your year in code poster is ready!`,
        },
        Body: {
          Text: {
            Data: `Thank you for taking the time to create your poster and sharing your creativity with the world. At Auth0 we love developers and we appreciate the work you do every day in creating a more convenient and secure world. 
  
            To download your poster: click here
            To share your poster on social media: click here
            
            A note from our benevolent sponsors at Auth0:
            
            Auth0 makes securing your apps simple, and secure even as you scale to the moon. Developers at 
            `,
          },
        },
      },
    }

    const res = await SES.sendEmail(params).promise()

    console.log(res)

    return {
      statusCode: 200,
    }
  } catch (error) {
    logger.error('Failed getting status. Error: ' + error)

    return createHttpError(500, 'ERROR getting status')
  }
}
