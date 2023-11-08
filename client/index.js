const axios = require('axios')
const niceList = require('../utils/niceList.json')
const MerkleTree = require('../utils/MerkleTree')
const readline = require('readline')

const serverUrl = 'http://localhost:1225'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const merkleTree = new MerkleTree(niceList)

function askForName () {
  rl.question(
    'Please enter your name (or type "quit" to exit): ',
    async name => {
      if (name.toLowerCase() === 'quit') {
        console.log('Exiting the program.')
        rl.close()
        return
      }

      const index = niceList.findIndex(n => n === name)
      const proof = merkleTree.getProof(index)

      const { data: gift } = await axios.post(`${serverUrl}/gift`, {
        proof,
        name
      })
      console.log({ gift })

      askForName()
    }
  )
}

function main () {
  askForName()
}

main()
