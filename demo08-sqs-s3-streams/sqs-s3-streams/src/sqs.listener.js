class Handler {
  async main (event) {
    const [{ body, messageId }] = event.Records
    const item = JSON.parse(body)
    try {
      console.log('event***', JSON.stringify({ ...item, messageId, at: new Date().toISOString() }, null, 2))
      return {
        statusCode: 200,
        body: 'OI'
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

const handler = new Handler()
module.exports = handler.main.bind(handler)
