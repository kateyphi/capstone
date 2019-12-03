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
      console.log('got to the open rooms socket')
      this.setState({rooms})
    })
  }

  componentDidMount = () => {
    this.getRooms()
  }

  componentDidUpdate = () => {
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
      this.setState({newRoom: '', newUser: ''})
    }
  }

  joinRoom = (room, user) => {
    if (this.state.newUser === '') {
      Swal.fire('Please enter a nickname to join.')
    } else {
      socket.emit('joinroom', room, user)
      socket.emit('get available rooms')
      this.setState({newRoom: '', newUser: ''})
    }
  }

  handleRoom = event => {
    this.setState({newRoom: event.target.value})
  }

  handleName = event => {
    this.setState({newUser: event.target.value})
  }

  render() {
    return (
      <div id="sidebar">
        <SideNav className="fixed" trigger={<Button>Rooms</Button>}>
          <SideNavItem>
            <Row>
              Enter your nickname:
              <Input
                placeholder="enter nickname"
                s={12}
                value={this.state.newUser}
                validate
                onChange={this.handleName}
              />
            </Row>
            <Row>
              To create a new room, enter a room name below and press Create
              Room.
              <Input
                placeholder="enter room name"
                s={12}
                value={this.state.newRoom}
                validate
                onChange={this.handleRoom}
              />
            </Row>
            <Button onClick={this.createRoom}>Create Room</Button>
          </SideNavItem>
          <SideNavItem divider />
          Or, to join an open room, click on one of the rooms below:
          {this.state.rooms.map(room => (
            <SideNavItem
              key={room.id}
              onClick={() => this.joinRoom(room[0], this.state.newUser)}
            >{`${room[0]}: ${room[1]} players`}</SideNavItem>
          ))}
        </SideNav>
      </div>
    )
  }
}

export default Sidebar
