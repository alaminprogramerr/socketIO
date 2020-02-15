const postRouter = require('express')()
const postContrler=require('../controler/postContrler')
const authenticate=require('../middleware/authenticate')


postRouter.get('/order/:id' , authenticate, postContrler.getSinglePost)//get a single post
postRouter.post('/order/delete/:id' , authenticate, postContrler.deletePost)
postRouter.post('/order/updatePost/:id' , authenticate, postContrler.updatePost)
postRouter.post('/order/filter', authenticate , postContrler.dateFilter)
 
module.exports= postRouter