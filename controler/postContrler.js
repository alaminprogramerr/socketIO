const RegisterModel=require('../model/registerModel')
const postModel=require('../model/postModel')
const postValidator=require('../validator/postValidator')
 
// create/post
const  createPost=(post)=>{
    let type=post.postCreator.type
    if(type.trim()== "ADMIN" || type.trim() == "USER"||type.trim()== "admin" || type.trim() == "user"){
        const {title, description, postCreator, providerId, status, location}=post

        let date = new Date()
        let  d= date.getDate()
        let  m= date.getMonth()+1
        let y= date.getFullYear()
        let createDate = y+'-'+m+'-'+d;
        new postModel({
            title,
            description,
            postCreator:postCreator,
            providerId,
            createdAt:createDate,
            status
        })
        .save()
        .then(Post=>{
            console.log('Post created successfull')
            return {massage:"Post created successful"}
        })
        .catch(err=>{
            console.log('error occurd in post  controler line 30')
            return {massage:"error occurd in post  controler line 30"}
        })
    }else{
        console.log({massage:"Only USER and  ADMIN  can create post "})
        return({massage:"Only USER and  ADMIN  can create post "})
    }
}

//  order/:id
// single POST founding by giving id in params 
const  getSinglePost=(req, res)=>{
	postModel.findOne({_id:req.params.id}).populate('RegisterModel').exec((err, data)=>{
        
        if(!data){
            return res.status(404).json({status:false , massage:"shop not found !"})
        }
        res.status(200).json(data)
    })
}
// /post/delete
const  deletePost=(req, res)=>{
    
    let type = req.user.type
    if(type.trim()=="ADMIN" ||type.trim()=="admin"){
        postModel.findByIdAndDelete(req.params.id)
        .then(post=>{
            if(!post){
                res.status(400).json({status:false, massage:"Post not found !"})
            }
            console.log(post)
            res.status(200).json({status:true , massage:"Post deleted !!"})
        })
        .catch(err=>{
            console.log(err)
        return res.status(500).json({massage:"Server error occurd"})
        })
    }else{
        return res.status(400).json({status:false, massage:"Only Admin can delete Post !"})
         
    }
}

//can update title , descrption  and status
const  updatePost=(req, res)=>{
    let type= req.user.type
    if(type.trim()== "ADMIN" || type.trim() == "USER"||type.trim()== "admin" || type.trim() == "admin"){

        const verify = postValidator.postUpdateValidator(req)
        if(!verify.isValid){
            return res.status(400).json(verify.err)
        }
        postModel.findByIdAndUpdate(req.params.id)
        .then(data=>{
                
                data.title=req.body.title
                data.description=req.body.description
                data.status=req.body.status
                data.save()
                .then(update=>{
                    console.log(update)
                    return res.status(200).json({massage:"Update success" , status:true})
                })
                .catch(err=>{
                    console.log(err)
                    return res.status(400).json({massage:"server error occurd"})
                })
        })
        .catch(err=>{
            console.log(err)
            res.status(400).json({massage:"Server error occurd "})
        })
    }else{
        return res.status(400).json({massage:"Only USER and  ADMIN  can edit post "})

    }
}


//filtering by date to date 
const dateFilter = (req, res )=>{
    let fromDate 
    let toDate 
    if(req.body.fromDate.split('-').join('')<req.body.toDate.split('-').join('')){
        fromDate=req.body.fromDate.split('-').join('')
        toDate=req.body.toDate.split('-').join('')
    }
    if(req.body.fromDate.split('-').join('')>req.body.toDate.split('-').join('')){
        
        fromDate=req.body.toDate.split('-').join('')
        toDate=req.body.fromDate.split('-').join('')
    }
    if(req.body.fromDate==req.body.toDate){
        
        fromDate=req.body.toDate.split('-').join('')
        toDate=req.body.fromDate.split('-').join('')
    }
    console.log('fromDate', fromDate)
    console.log('toDate', toDate)
    postModel.find()
    .then(posts=>{
        let filtered=[]
        posts.forEach(post=>{
            let pD= post.createdAt.split('-')
            let compaireDate=pD.join('')
            if(compaireDate>=fromDate && compaireDate<=toDate){
                filtered.push(post)
            }
        })
        if(filtered.length<1){
            return res.status(400).json({massage:"No post founded ! " , status:false})
        }
        return res.status(200).json({massage:" post funded !" ,filtered:filtered})
    })
    .catch(err=>{
        console.log(err)
       return res.status(500).json({massage:"server error occurd "})
    })
}


module.exports={
    
    createPost,
    getSinglePost,
    deletePost,
    updatePost , 
    dateFilter
}


