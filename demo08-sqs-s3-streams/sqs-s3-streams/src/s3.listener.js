const AWS = require('aws-sdk')
const { Writable, pipeline } = require('stream')
const csvtojson = require('csvtojson')

class Handler {
  constructor ({ s3Svc, sqsSvc }) {
    this.s3Svc = s3Svc
    this.sqsSvc = sqsSvc
    this.QueueName = process.env.SQS_QUEUE
  }

  static getSdks () {
    const host = process.env.LOCALSTACK_HOST || 'localhost'
    const port = process.env.LOCALSTACK_PORT || '4566'
    const isLocal = process.env.IS_LOCAL
    const endpoint = new AWS.Endpoint(`http://${host}:${port}`)

    const config = {
      endpoint: endpoint,
      s3ForcePathStyle: true
    }
    if (!isLocal) delete config.endpoint
    console.log(config)
    return {
      s3: new AWS.S3(config),
      sqs: new AWS.SQS(config)
    }
  }

  async GetQueueUrl () {
    const { QueueUrl } = await this.sqsSvc.getQueueUrl({
      QueueName: this.QueueName
    }).promise()
    return QueueUrl
  }

  processDataOnDemand (queueUrl) {
    const writableStream = new Writable({
      write: (chunk, enconding, done) => {
        const item = chunk.toString()
        console.log('sending...', item, 'at', new Date().toISOString())
        this.sqsSvc.sendMessage({
          QueueUrl: queueUrl,
          MessageBody: item
        }, done)
      }
    })
    return writableStream
  }

  async pipefyStreams (...args) {
    return new Promise((resolve, reject) => {
      pipeline(...args, error => error ? reject(error) : resolve())
    })
  }

  async main (event) {
    const [
      {
        s3: {
          bucket: {
            name
          },
          object: {
            key
          }
        }
      }
    ] = event.Records
    console.log('processing', name, key)
    try {
      console.log('getting queue url...')
      const params = {
        Bucket: name, Key: key
      }
      const queueUrl = await this.GetQueueUrl()
      console.log('queueUrl', queueUrl)
      // console.log('event***', JSON.stringify(event, null, 2))
      // this.s3Svc.getObject(params).createReadStream()
      //   .pipe(csvtojson())
      //   .pipe(this.processDataOnDemand(queueUrl))

      // transforma a stream em assincrona não precisando trabalhar com callbacks
      await this.pipefyStreams(
        this.s3Svc.getObject(params).createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl))

      console.log('process finished', new Date().toISOString())

      return {
        statusCode: 200,
        body: 'Process finished with success!!'
      }
    } catch (error) {
      console.log('error', error.stack)
      return {
        statusCode: 500,
        body: 'OI'
      }
    }
  }
}
const { s3, sqs } = Handler.getSdks()
const handler = new Handler({ s3Svc: s3, sqsSvc: sqs })
module.exports = handler.main.bind(handler)
