'use strict'

module.exports.public = async (event) => {
  console.log('requesting public route...')
  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: 'Flash',
          power: 'Speed'
        }
      ],
      null,
      2
    )
  }
}

module.exports.private = async (event) => {
  console.log('requesting private route...')
  // console.log('User:', JSON.parse(event.requestContext.authorizer.user))
  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: 'Barman',
          power: 'Rich'
        }
      ],
      null,
      2
    )
  }
}
