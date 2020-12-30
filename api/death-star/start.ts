import {SQSHandler} from 'aws-lambda'

const start: SQSHandler = (event, _context, callback) => {
  console.log(event)

  callback(null)
}

export default start
