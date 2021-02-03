import * as dynamoose from 'dynamoose'

if (process.env.NODE_ENV !== 'production') {
  dynamoose.aws.sdk.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-east-1',
    sslEnabled: false,
  })
  dynamoose.aws.ddb.local('http://127.0.0.1:8000')
}

export default dynamoose
