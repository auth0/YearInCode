const tables = [
  {
    TableName: 'nebula-serverless-connection-dev',
    AttributeDefinitions: [
      {AttributeName: 'connectionId', AttributeType: 'S'},
      {AttributeName: 'userId', AttributeType: 'S'},
    ],
    KeySchema: [{AttributeName: 'connectionId', KeyType: 'HASH'}],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userIdIndex',
        KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
        Projection: {ProjectionType: 'ALL'},
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
  {
    TableName: 'nebula-serverless-poster-dev',
    AttributeDefinitions: [
      {AttributeName: 'userId', AttributeType: 'S'},
      {AttributeName: 'posterSlug', AttributeType: 'S'},
    ],
    KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userIdIndex',
        KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
        Projection: {ProjectionType: 'ALL'},
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
]

process.env['CONNECTION_TABLE'] = 'nebula-serverless-connection-dev'
process.env['POSTER_TABLE'] = 'nebula-serverless-poster-dev'

module.exports = {
  tables,
  basePort: 8050,
}
