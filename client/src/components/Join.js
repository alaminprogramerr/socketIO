import React  , { useState , useEffect}from 'react'
import {Link} from 'react-router-dom'
import SocketIO from 'socket.io-client'
import {Card , CardHeader , CardBody, Input} from 'reactstrap'

const Join=() =>{

    const [name , setName]= useState('')
    const [room , setRoom]= useState('')
    const [email, setEmail]=useState('')
    const [type, setType]=useState('')
    const [lat, setLat]=useState('')
    const [lon, setLon]=useState('')
    const ENDPOINT = 'localhost:5000'

    const doJoin=(event)=>{
        const IO = SocketIO(ENDPOINT)
        let obj={
            name, email, type, location:{lat, lon}
        }
        IO.on('newPost', (obj)=>{
            console.log(obj)
        })
        if(name && room && email && type &&  lat && lon  ){
            event.preventDefault()
            IO.emit('join' , obj)
        }
    }

    return (

        <Card className="col-md-4 offset-md-4 p-5 mt-5">
            <CardHeader className=" text-center">
                <h3 className="text-success">Join Application</h3>
            </CardHeader>
            <CardBody className="card-content">
                <Input className = "form-control mb-2"  placeholder= " Name" onChange={(event)=>{setName(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Room" onChange={(event)=>{setRoom(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Email" onChange={(event)=>{setEmail(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Type" onChange={(event)=>{setType(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Lat" onChange={(event)=>{setLat(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " lon" onChange={(event)=>{setLon(event.target.value)}}/>

            </CardBody>
            {

            }
            <Link to='' onClick={doJoin} style={{color:"white"}} className="btn btn-success">
                Join
            </Link>
        </Card>
    )
}

export default Join
