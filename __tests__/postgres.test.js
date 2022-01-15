/* globals describe, it, afterEach */

const { system } = require('gluegun')
fs = require('fs')
const { expect } = require('chai')

const projectName = 'herbs-lab'

describe('When I generate a complete project that uses postgres', () => {
  afterEach(async () => {
    await fs.rmdirSync(projectName, { recursive: true })
  })

  it('must exists a config/postgres.js file', async () => {
    await system.run(`herbs new --name ${projectName}  --description "testing the herbs CLI"  --author herbs --license MIT --graphql --rest --postgres --git`)
    await fs.readFileSync(`${__dirname}/../${projectName}/src/infra/config/postgres.js`)
  })

  it('must contain the correct content', async () => {
    await system.run(`herbs new --name ${projectName}  --description "testing the herbs CLI"  --author herbs --license MIT --graphql --rest --postgres --git`)
    const postgresConfig = require(`${__dirname}/../${projectName}/src/infra/config/postgres.js`)
    expect(postgresConfig).is.not.null
    expect(postgresConfig).to.deep.equal({
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        user: 'postgres',
        database: '',
        password: 'postgres'
      }
    })

   
  })
})
