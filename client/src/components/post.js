import React  , { useState , useEffect}from 'react'
import {Link} from 'react-router-dom'
import SocketIO from 'socket.io-client'
import {Card , CardHeader , CardBody, Input} from 'reactstrap'

const Join=() =>{

const [title, setTitle]=useState('')
const [description, setDescription]=useState('')
const [providerId, setProviderId]=useState('')
const [status,setStatus]=useState('')
const [lat, setLat]=useState('')
const [lon, setLon]=useState('')
const ENDPOINT = 'localhost:5000'

        useEffect(()=>{
        const IO = SocketIO(ENDPOINT)

            IO.on('newPost' , obj=>{
                console.log(obj)
            })
        })
    const doJoin=(event)=>{
        const IO = SocketIO(ENDPOINT)

        let obj = {
            
            title:"this is title ",
            description:"this is description ",
            postCreator:{
                type:'user',
                name:"post creator " , 
                email:"creator email" , 
                location:{
                    lat:'23.7518', 
                    lon:'90.4254'
                }
            },
            providerId:5343,
            status:'Accepted'
        }
      
        IO.emit('doPost', obj)
        IO.on('newPost', obj =>{
            console.log(obj)
        })
        IO.on('doPostResult' , obj=>{
            console.log(obj)
        })
    }
    return (

        <Card className="col-md-4 offset-md-4 p-5 mt-5">
            <CardHeader className=" text-center">
                <h3 className="text-success">Join Application</h3>
            </CardHeader>
            <CardBody className="card-content">
                {/* <Input className = "form-control mb-2"  placeholder= " Title" onChange={(event)=>{setTitle(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Description" onChange={(event)=>{setDescription(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " providerId" onChange={(event)=>{setProviderId(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " Lat" onChange={(event)=>{setLat(event.target.value)}}/>
                <Input className = "form-control mb-2"  placeholder= " lon" onChange={(event)=>{setLon(event.target.value)}}/> */}

                <button onClick={doJoin}>Click to post</button>
            </CardBody>
            {

            }
            {/* <Link to='' onClick={doJoin} style={{color:"white"}} className="btn btn-success">
                Join
            </Link> */}
        </Card>
    )
}

export default Join
