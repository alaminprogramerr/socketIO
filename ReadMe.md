to Join a user to socket io =>
    please do a emit from frontend like this:
        emit example =>IO.emit('join' , obj)
        obj example=> {
            name:'neme', 
            email:'email@gmil.com, (it  have given while  logined user  via token )
            type, 
            location:{
                lat:"value", 
                lon:"value"
                }
            }
Note:pls make sure  emit and  obj  and all thing  formate as like given example


*to create a post my server expecting like:
    emit  will like :   IO.emit('doPost',  obj)
    obj  will like  : let obj = {
            title:"this is title ",
            description:"this is description ",
            postCreator:{
                id:"47c6d5a047a620284aa" //please make sure this id must need  to provide
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
Note:pls make sure  emit and  obj  and all thing  formate as like given example


* To get notification about new post receive emit like 
    aaccepting emit =>IO.on('newPost', (obj)=>{
                                console.log(obj)
                            })

for closing a socket  for a user will like :
        IO.on('doPostResult' , obj=>{
            console.log(obj)
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

 other thing will do with http requiest:
 

POST MANAGE  ROUTE 
=====================



postRouter.get('/order/:id' , authenticate, postContrler.getSinglePost)//get a single post
postRouter.post('/order/delete/:id' , authenticate, postContrler.deletePost)//to delete a post
postRouter.post('/order/updatePost/:id' , authenticate, postContrler.updatePost)//to update a post
postRouter.post('/order/filter' , postContrler.dateFilter) // to get all post by given from date / to date /  and status 
postRouter.post('/order/:id' , postContrler.dateFilterForSingleUser)//toget all post a single user / admin / provider
postRouter.get('/order/getAllPost', authenticate , postContrler.getAllPost)//for get all post  without post
 


USER MANAGE ROUTE
=====================
userRouter.post('/auth/login' ,userControler.loginControler)//login
userRouter.post('/auth/register', userControler.registerControler)//register
userRouter.post('/auth/forget',   userControler.forget)//forget
userRouter.post('/auth/reset' , authenticate , userControler.reset)//reset
userRouter.get('/auth/me',authenticate, userControler.getMe)//get informaton about profile
userRouter.post('/auth/me', authenticate , userControler.postMe)///update profile 