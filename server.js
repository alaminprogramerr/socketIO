const express=require('express')
const PORT = process.env.PORT || 5000
const mongoose =require ('mongoose')
const app =express()
const morgan =require('morgan')
const bodyParser=require('body-parser')
const passport =require('passport')
const orderRouter=require('./router/orderRouter')
const socketIO = require('socket.io')
const http = require('http')
const userRouter =require('./router/userRouter')


mongoose .connect('mongodb://localhost/shop_management',{useUnifiedTopology:true, useNewUrlParser:true, useFindAndModify:false})
.then(()=>{
    console.log('Mongodb connected successfull', )
})
.catch(err=>{
    console.log('Database connnection faild ')
})

// using middleware to server 
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())
require('./passport')(passport)

// using  route to server








app.use(userRouter)
app.use(orderRouter)



// socket io
const server= http.createServer(app)
const IO = socketIO(server)
const filterer = require('./socket/filterUserToSendNotification')
const postControler = require('./controler/postContrler')
const userManege =require('./socket/users')
const postModel = require('./model/postModel')


IO.on('connection' , (socket)=>{
    let users= userManege.users
    socket.on('join', (user=>{
        const joinde=userManege.addUser({id:socket.id, email:user.email, type:user.type, location:user.location})
        console.log( joinde.message)
    }))
    socket.on('doPost', obj=>{
        postControler.createPost(obj)
        const nearByUser= filterer(users , obj.postCreator.location, 6) 
        console.log('nearByUser' , nearByUser)
        nearByUser.forEach(element=>{
            socket.broadcast.to(element.id).emit('newPost' , {message:"A new post has been created !", Post:obj })
        })
    })
    //to accept a please do a emit with 'doAccept' with a single post id 
    socket.on('doAccept' ,obj=>{
        postModel.findByIdAndUpdate(obj.id)
        .then(post=>{
            post.status="accepted"
            post.save()
            .then(done=>{
                socket.emit('accepted', {message:"Post accepted", postID:obj.id})
            })
        })
    })
    // to decline a  post please do emit with doDecline emit
    socket.on('deDecline' , obj=>{
        postModel.findByIdAndUpdate(obj.id)
        .then(post=>{
            post.status='decline'
            post.save()
            .then(done=>{
                socket.emit('accepted', {message:"Post accepted", postID:obj.id})
            })
        })
    })
    socket.on('disconnect' , ()=>{
        let spliceUser=userManege.removeUser(socket.id)
        users=spliceUser        
    })

})

server.listen(PORT , ()=>{
    console.log('Server started on port : ', PORT)
})