import React from 'react'
import socket from '../socket'
import {SideNav, SideNavItem, Button, Row, Input} from 'react-materialize'
import Swal from 'sweetalert2'

class Sidebar extends React.Component {
  constructor() {
    super()
    this.state = {
      rooms: [],
      current: [],
      newRoom: '',
      newUser: ''
    }

    socket.on('open rooms', rooms => {
      this.setState({rooms})
      console.log('got to the open rooms socket', this.state)
    })

    socket.on('sidebar username', newUser => {
      this.setState({newUser})
    })
  }

  componentDidMount = () => {
    this.getRooms()
  }

  getRooms = () => {
    socket.emit('get available rooms')
  }

  // 1) when a user enters a room name, it goes onto state under the 'newRoom' property, and when they click 'Create Room', it triggers this createRoom method, which emits the 'joinroom' socket, which is found in server/socket/index.js, passing in the 'newRoom' string currently on state. ///1
  createRoom = event => {
    if (this.state.newUser === '') {
      Swal.fire('Please enter a nickname to join.')
    } else {
      socket.emit('joinroom', this.state.newRoom, this.state.newUser)
      socket.emit('get available rooms')
      this.setState({newRoom: '', newUser: ''})
    }
  }

  joinRoom = (room, user) => {
    socket.emit('joinroom', room, user)
    socket.emit('get available rooms')
    this.setState({newRoom: '', newUser: ''})
  }

  handleRoom = event => {
    this.setState({newRoom: event.target.value})
  }

  handleName = event => {
    this.setState({newUser: event.target.value})
  }

  render() {
    return (
      <div className="sidebar">
        {}
        <SideNav className="fixed">
          <Row>
            <div id="golden">
              To create a new room, enter a room name below and press Create
              Room.
            </div>

            <Input
              placeholder="enter room name"
              s={12}
              value={this.state.newRoom}
              validate
              onChange={this.handleRoom}
            />
          </Row>
          <Button onClick={this.createRoom}>Create Room</Button>
          <div id="golden">
            Or, to join an open room, click on one of the rooms below:
          </div>

          {this.state.rooms.map(room => (
            <SideNavItem
              key={room.id}
              onClick={() => this.joinRoom(room[0], this.state.newUser)}
            >
              <text style={{fontWeight: 'bold'}}>Room:</text> {room[0]}{' '}
              <text style={{fontWeight: 'bold'}}>{room[1]} players:</text>{' '}
              {room[2].join(', ')}
            </SideNavItem>
          ))}
        </SideNav>
      </div>
    )
  }
}

export default Sidebar
