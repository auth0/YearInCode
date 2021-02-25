import * as dynamoose from 'dynamoose'

if (process.env.IS_OFFLINE) {
  dynamoose.aws.sdk.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-east-1',
    sslEnabled: false,
  })
  dynamoose.aws.ddb.local('http://127.0.0.1:8000')
}

if (process.env.NODE_ENV === 'test') {
  dynamoose.aws.sdk.config.update({
    sslEnabled: false,
    region: 'local',
  })
  dynamoose.aws.ddb.local(process.env.MOCK_DYNAMODB_ENDPOINT)

  process.env['CONNECTION_TABLE'] = 'nebula-serverless-connection-dev'
  process.env['POSTER_TABLE'] = 'nebula-serverless-poster-dev'
}

export default dynamoose
