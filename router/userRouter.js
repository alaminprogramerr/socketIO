const express=require('express')
const userRouter = express()
const userControler= require('../controler/userControler')
const authenticate =require('../middleware/authenticate')

userRouter.post('/auth/login' ,userControler.loginControler)//done
userRouter.post('/auth/register', userControler.registerControler)//done
userRouter.post('/auth/forget',   userControler.forget)//done
userRouter.post('/auth/reset' , authenticate , userControler.reset)//done
userRouter.get('/auth/me',authenticate, userControler.getMe)//done
userRouter.post('/auth/me', authenticate , userControler.postMe)//done


 module.exports= userRouter