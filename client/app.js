import React from 'react'

import Sidebar from './components/Sidebar'
import Routes from './routes'
import Chat from './components/Chat/Chat'

const App = () => {
  return (
    <div className="main">
      {/* <div className="flex"> */}
      <Sidebar />
      <Routes />
      <div id="chat">
        <Chat />
      </div>
      {/* </div> */}
    </div>
  )
}

export default App
