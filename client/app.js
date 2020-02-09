import React from 'react'

import Sidebar from './components/Sidebar'
import Table from './components/Table'
import Swal from 'sweetalert2'
import socket from './socket'
import Landing from './components/Landing'

const App = () => {
  // let name = ''
  // let room = ''
  // Swal.mixin({
  //   input: 'text',
  //   confirmButtonText: 'Submit',
  //   progressSteps: ['1', '2'],
  //   allowOutsideClick: false
  // })
  //   .queue([
  //     {
  //       title: 'Nickname',
  //       text: 'Welcome to CodeWords! Enter a nickname:',
  //       inputValidator: value => {
  //         if (!value) {
  //           return 'Please enter a nickname'
  //         }
  //       }
  //     },
  //     {
  //       title: 'Room',
  //       text:
  //         'If you already know the name of game room you would like to join, enter it below. If you do not enter a room name, you will be taken to the Lobby where you can view open rooms or create your own.'
  //     }
  //   ])
  //   .then(result => {
  //     if (!result.value[0]) {
  //       Swal.fire('Please go back and enter a nickname.')
  //     } else if (result.value[1] === '') {
  //       socket.emit('joinroom', 'lobby', result.value[0])
  //     } else {
  //       socket.emit('joinroom', result.value[1], result.value[0])
  //       socket.emit('get available rooms')
  //     }
  //   })
  return (
    <div className="main">
      {/* <Sidebar />
      <Table /> */}
      <Landing />
    </div>
  )
}

export default App
