import React, {useEffect , useState} from 'react'
import SocketIO from 'socket.io-client'


function Chat() {
    const ENDPOINT = 'localhost:5000'
    const socket= SocketIO(ENDPOINT)

    const getuser=()=>{
        console.log('getting')
        socket.on('currentUser', user=>{
            console.log(user)
        })
    }
    return (
        <div>
            <button onClick={getuser}>click</button>
        </div>
    )
}

export default Chat
