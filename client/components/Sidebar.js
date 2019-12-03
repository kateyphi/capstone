import React from 'react'
import socket from '../socket'
import {Link} from 'react-router-dom'
import {SideNav, SideNavItem, Button, Row, Input} from 'react-materialize'

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
    socket.emit('joinroom', this.state.newRoom, this.state.newUser)
  }

  joinRoom = (room, user) => {
    socket.emit('joinroom', room, user)
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
              <Input
                placeholder="enter room name"
                s={12}
                label="Room"
                validate
                onChange={this.handleRoom}
              />
            </Row>
            <Row>
              <Input
                placeholder="enter username"
                s={12}
                label="Name"
                validate
                onChange={this.handleName}
              />
            </Row>

            <Button onClick={this.createRoom}>Create Room</Button>
          </SideNavItem>
          <SideNavItem divider />
          <SideNavItem>
            <Button onClick={this.getRooms}>Find available rooms</Button>
          </SideNavItem>
          {this.state.rooms.map(room => (
            <SideNavItem
              onClick={() => this.joinRoom(room[0], this.state.newUser)}
            >{`${room[0]}: ${room[1]} players`}</SideNavItem>
          ))}
          {window.location.href.slice(-1) === '!' ? null : (
            <SideNavItem>
              <Link to="/rules">
                <Button>How to Play</Button>{' '}
                {console.log(window.location.href.slice(-1))}
              </Link>
            </SideNavItem>
          )}
        </SideNav>
      </div>
    )
  }
}

export default Sidebar
