const bcrypt =require('bcryptjs')
const RegisterModel =require('../model/registerModel')
const userValidator=require('../validator/userValidator')
const jwt=require('jsonwebtoken')



const reg=(req, res)=>{
	RegisterModel.findOne({email:req.body.email})
	.then(user=>{
		if(user){
			return res.status(400).json({email:"user  exist"})
		}else{
			bcrypt.hash(req.body.password, 12,((err, hash)=>{
				if(err){
					console.log(err)
					res.status(500).json({massage:"Server error occurd "})
				}else{
					const newUser=  new RegisterModel({
						name:req.body.name,
						email:req.body.email,
						type:req.body.type,
						password:hash
					})
					newUser.save()
					.then(user=>{
						console.log('user' , user)
						res.json({massage:"user created success full "})
					})
					.catch(err=>{
						console.log(err)
					})
				}
			}))
		}
	})
	.catch(err=>{
		console.log(err)
		res.json({massage:"server error occurd "})
	})
}


const welcome=(req, res)=>{
    res.status(200).json({massage:"Welcome to our Server"})
}

const forget=(req, res)=>{
	if(!req.body.email){
		res.status(400).json({massage:"Please provide email address !"})
	}
	RegisterModel.findOne({email:req.body.email})
	.then(user=>{
		if(!user){
			return res.status(400).json({ status:false ,massage:"User not founded"})
		}
		return res.status(200).json({ status:true ,massage:"Please check inbox"})
	})
	.catch(err=>{
		console.log(err)
		 return res.status(500).json({massage:"Server error occurd"})
	})
}

const registerControler=(req, res)=>{
    
    let varify = userValidator.RegisterValidator(req.body)
    if(!varify.isValid){
        return res.status(400).json(varify.err)
    }
	RegisterModel.findOne({email:req.body.email})
	.then(user=>{
		if(user){
			return res.status(400).json({email:"User allready exist ", status :false})
		}else{
			bcrypt.hash(req.body.password, 12,((err, hash)=>{
				if(err){
					console.log(err)
					res.status(500).json({massage:"Server error occurd "})
				}else{
					const newUser= new RegisterModel({
                        name:req.body.name,
                        email:req.body.email,
						password:hash, 
						type:req.body.type,
						file:''
                    })
					newUser.save()
					.then(user=>{
						console.log(user)
						let token= jwt.sign({name:user.name, email:user.email , _id:user._id} , 'secret' , {expiresIn:'2h'})
						res.json({status:true,massage:"Register Success ", _id:user._id, token:token})
					})
					.catch(err=>{
						console.log(err)
					})
				}
			}))
		}
	})
	.catch(err=>{
		console.log(err)
		res.json({massage:"server error occurd "})
	})
}

const loginControler=(req,res)=>{
    let varify =  userValidator.loginValidator({email:req.body.email, password:req.body.password})
    if(!varify.isValid){
        return res.status(400).json(varify.err)
    }
	RegisterModel.findOne({email:req.body.email})
	.then(user=>{
		if(!user){
		    return	res.status(404).json({massage:"User not found !", status:false});
		}
        bcrypt.compare(req.body.password, user.password)
        .then(result=>{
            if(!result){
                return res.status(400).json({massage:" Wrong password", status:false})
			}
			let payload={name:user.name, email:user.email, id:user._id, type:user.type}
			let token = jwt.sign(payload, "secret" , {expiresIn:'4h'})
            res.status(200).json({massage:"Login successfull !", status:true, userId:user._id , token:token  } )
        })
	})
	.catch(err=>{
		console.log(err)
		res.json({err:err})
	})
}
// auth/reset
const reset=(req,res)=>{
	console.log(req.body)
	const {email , oldPassword , newPassword  }=req.body
	let verify =userValidator.reset(req.body)
	if(!verify.isValid){
		return res.status(400).json(verify.err)
	}

	RegisterModel.findByIdAndUpdate({_id:req.user.id})
	.then(user=>{
		if(!user){
			return res.status(400).json({massage:"user Not found"})
		}
		bcrypt.compare(oldPassword , user.password , (err , result)=>{
			if(err){
				return res.status(400).json({massage:"Error occure while changing password"})
			} 
			if(!result){
				return res.status(400).json({massage:"Wrong password provided"})
			}
			bcrypt.hash(newPassword ,12 , (err , hash)=>{
				if(err){
					console.log(err)
					return res.json({massage:"server error "})
				}
				user.password=hash
				user.save()
				.then(data =>{
					return res.status(200).json({status:true,massage:"Password change successfull"})
				})
				.catch(err=>{
					console.log(err)
					return res.status(200).json({massage:"Server error occurd"})
				})
			} )
		})

	})
	.catch(err=>{
		res.json({err})
	})
}

const getMe=(req, res)=>{ 
	RegisterModel.findOne({email:req.user.email})
	.then(user=>{
		if(!user){
			return res.status(400).json({massage:"User not found", status:false})
		}
		return res.status(200).json({name:user.name, email:user.email})

	})
}
const postMe=(req, res)=>{
	const {name,email}=req.body
	const user=req.user
	
	let verify = userValidator.postMeUpdateValidator(req.body)
	if(!verify.isValid){
		return res.status(400).json(verify.err)
	}
	RegisterModel.findOneAndUpdate({email:user.email})
	.then(user=>{
		if(!user){
			return  res.status(400).json({massage:"User not founded" , status:faild})
		}
		user.name=name
		user.email=email
		user.save()
		.then(success=>{
			console.log(success)
			return res.status(200).json({massage:"Updated successfully"  , status:true})
		})
	})
}

module.exports={
    welcome,
    registerControler,
	loginControler,
	getMe,
	postMe,
	forget,
	reset ,
	reg
} 