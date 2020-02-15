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
 


 other thing will do with http requiest:
 

POST MANATE  ROUTE 
=====================
postRouter.get('/order/:id' , postContrler.getSinglePost)//get a single post
postRouter.post('/order/delete/:id' , postContrler.deletePost)//delete a post
postRouter.post('/order/updatePost/:id' , authenticate, postContrler.updatePost)//give id in paraam to update a post
postRouter.post('/order/filter' , postContrler.dateFilter)//filter date to date filter
 


USER MANAGE ROUTE
=====================
userRouter.post('/auth/login' ,userControler.loginControler)//login
userRouter.post('/auth/register', userControler.registerControler)//register
userRouter.post('/auth/forget',   userControler.forget)//forget
userRouter.post('/auth/reset' , authenticate , userControler.reset)//reset
userRouter.get('/auth/me',authenticate, userControler.getMe)
userRouter.post('/auth/me', authenticate , userControler.postMe)