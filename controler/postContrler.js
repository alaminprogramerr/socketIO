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


//filtering by date to date and status  from all 
const dateFilter = (req, res )=>{
    if(!req.body.fromDate || !req.body.toDate){
        return res.status(400).json({message:"Please Enter from Date and to Date"})
    }
    let fromDate 
    let toDate 
    let dateArray1= req.body.fromDate.split('-')
    var date1=dateArray1[0]+"-"+dateArray1[1]+"-"+dateArray1[2];
    let dateArray2= req.body.toDate.split('-')
    var date2=dateArray2[0]+"-"+dateArray2[1]+"-"+dateArray2[2];

    if(new Date(date1).getTime()<new Date(date2).getTime()){
        fromDate=new Date(date1).getTime()
        toDate=new Date(date2).getTime()
    }
    if(new Date(date1).getTime()>new Date(date2).getTime()){
        
        fromDate=new Date(date2).getTime()
        toDate=new Date(date1).getTime()
    }
    if(date1==date2){
        
        fromDate=new Date(date2).getTime()
        toDate=new Date(date1).getTime()
    }
    // console.log('fromDate', fromDate)
    // console.log('toDate', toDate)
    postModel.find()
    .then(posts=>{
        let filtered=[]
        posts.forEach(post=>{
            let pD= post.createdAt.split('-')
            let compaireDate=new Date(pD).getTime()
            // console.log('date1', fromDate)
            // console.log("date2" , toDate)
            // console.log('compaireDate', compaireDate)
            if(compaireDate>=fromDate && compaireDate<=toDate){
                filtered.push(post)
            }
        })
        if(filtered.length<1){
            return res.status(400).json({massage:"No post founded ! " , status:false})
        }
        if(req.body.status==="all"|| req.body.status==="All" || req.body.status==="ALL"){
            console.log('your got all')
            return res.status(200).json({massage:" post funded !" ,All:filtered})
        }
        
        if(req.body.status==="COMPLETED"|| req.body.status==="completed" || req.body.status==="Completed"){
            let completed =[]
            filtered.forEach(single=>{
                if(single.status==="COMPLETED"|| single.status==="completed" || single.status==="Completed"){
                    completed.push(single)
                }
            })
            console.log('your got completed')

            return res.status(200).json({massage:" post funded !" ,completed:completed})
        }
        
        
        if(req.body.status==="ACCEPTED"|| req.body.status==="accepted" || req.body.status==="Accepted"){
            let accepted =[]
            filtered.forEach(single=>{
                console.log(' status single', single.status)
                if(single.status==="accepted"|| single.status==="ACCEPTED" || single.status==="Accepted"){
                    accepted.push(single)
                }else{
                    
                }
            })
            console.log('your got accepted')

            return res.status(200).json({massage:" post funded !" ,accepted:accepted})
        }
        return res.status(400).json({massage:" Please provide form date , to date, and status properly  !" })
    })
    .catch(err=>{
        console.log(err)
       return res.status(500).json({massage:"server error occurd "})
    })
}


//filtering by date to date and status  from all 
const dateFilterForSingleUser = (req, res )=>{
    if(!req.body.fromDate || !req.body.toDate){
        return res.status(400).json({message:"Please Enter from Date and to Date"})
    }
    let fromDate //timestamp one
    let toDate //timestap two
    let dateArray1= req.body.fromDate.split('-')
    var date1=dateArray1[0]+"-"+dateArray1[1]+"-"+dateArray1[2];
    let dateArray2= req.body.toDate.split('-')
    var date2=dateArray2[0]+"-"+dateArray2[1]+"-"+dateArray2[2];

    if(new Date(date1).getTime()<new Date(date2).getTime()){
        fromDate=new Date(date1).getTime() //timestapmp
        toDate=new Date(date2).getTime()//timestamp
    }
    if(new Date(date1).getTime()>new Date(date2).getTime()){
        
        fromDate=new Date(date2).getTime()
        toDate=new Date(date1).getTime()
    }
    if(date1==date2){
        
        fromDate=new Date(date2).getTime()
        toDate=new Date(date1).getTime()
    }
    // console.log('fromDate', fromDate)
    // console.log('toDate', toDate)
    postModel.find()
    .then(posts=>{
        let filtered=[]
        posts.forEach(post=>{
            let pD= post.createdAt.split('-')
            let compaireDate=new Date(pD).getTime()
            // console.log('date1', fromDate)
            // console.log("date2" , toDate)
            // console.log('compaireDate', compaireDate)
            if(compaireDate>=fromDate && compaireDate<=toDate && req.params.id==post.postCreator.id){
                filtered.push(post)
            }
        })
        if(filtered.length<1){
            return res.status(400).json({massage:"No post founded ! " , status:false})
        }
        if(req.body.status==="all"|| req.body.status==="All" || req.body.status==="ALL"){
            console.log('your got all')
            return res.status(200).json({massage:" post funded !" ,All:filtered})
        }
        
        if(req.body.status==="COMPLETED"|| req.body.status==="completed" || req.body.status==="Completed"){
            let completed =[]
            filtered.forEach(single=>{
                if(single.status==="COMPLETED"|| single.status==="completed" || single.status==="Completed"){
                    completed.push(single)
                }
            })
            console.log('your got completed')

            return res.status(200).json({massage:" post funded !" ,completed:completed})
        }
        
        
        if(req.body.status==="ACCEPTED"|| req.body.status==="accepted" || req.body.status==="Accepted"){
            let accepted =[]
            filtered.forEach(single=>{
                console.log(' status single', single.status)
                if(single.status==="accepted"|| single.status==="ACCEPTED" || single.status==="Accepted"){
                    accepted.push(single)
                }else{
                    
                }
            })
            console.log('your got accepted')
            return res.status(200).json({massage:" post funded !" ,accepted:accepted})
        }
        
        if(req.body.status==="PENDING"|| req.body.status==="Pending" || req.body.status==="pending"){
            let pending =[]
            filtered.forEach(single=>{
                console.log(' status single', single.status)
                if(single.status==="pending"|| single.status==="PENDING" || single.status==="pending"){
                    pending.push(single)
                }else{
                    
                }
            })
            console.log('your got pending')
            return res.status(200).json({massage:" post funded !" ,pending:pending})
        }
        return res.status(400).json({massage:" Please provide form date , to date, and status properly  !" })
    })
    .catch(err=>{
        console.log(err)
       return res.status(500).json({massage:"server error occurd "})
    })
}


const getAllPost=(req, res)=>{
    postModel.find()
    .then(data=>{
         return res.status(200).json({Posts:data})
    })
    .catch(err=>{
        console.log(err)
         return res.status(500).json({massage:"server error "})
    })

}
module.exports={
    
    createPost,
    getSinglePost,
    deletePost,
    updatePost , 
    dateFilter, 
    getAllPost:getAllPost,
    dateFilterForSingleUser,
    
}


