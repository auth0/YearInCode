import {APIGatewayProxyEvent} from 'aws-lambda'
import AWS from 'aws-sdk'

const S3 = new AWS.S3({
  ...(process.env.IS_OFFLINE && {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint('http://localhost:4569').href,
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  }),
})

export async function testImage(event: APIGatewayProxyEvent) {
  const res = await S3.putObject({
    Bucket: process.env.POSTER_BUCKET,
    Key: Math.ceil(Math.random() * 8000).toString(),
    Body: 'abcd',
  }).promise()

  console.log(res)

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  }
}
