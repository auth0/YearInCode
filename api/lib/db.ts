import * as dynamoose from 'dynamoose'

if (process.env.NODE_ENV !== 'production') {
  dynamoose.aws.sdk.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-east-1',
  })
  dynamoose.aws.ddb.local('http://127.0.0.1:8000')
  dynamoose.aws.sdk.config.update({
    sslEnabled: false,
  })
}

export default dynamoose
