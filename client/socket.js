import io from 'socket.io-client'

const socket = io(
  window.location.origin || 'https://codewords-1909-gracehopper.herokuapp.com/'
)

socket.on('connect', () => {
  console.log('Connected!')
})

export default socket
