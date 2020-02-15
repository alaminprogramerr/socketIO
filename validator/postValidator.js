module.exports={
    postCreateValidator(req){
                
        let err={}
        if(!req.body.title){
            err.title="Title required !!"
        }
        if(!req.body.description){
            err.description="Description required !!"
        }
        if(!req.body.userId){
            err.userId="User ID required !"
        }
        if(!req.body.providerId){
            err.providerId="Provider ID required !!"
        } 
        if(!req.body.status){
            err.status="Status required !!"
        }
        if(!req.body.location){
            err.location="Location required !!"
        }
        return {
            err:err,
            isValid:Object.keys(err).length===0
        }
    },
    postUpdateValidator(req){
        
        let err={}
        if(!req.body.title){
            err.title="Title required !!"
        }
        if(!req.body.description){
            err.description="Description required !!"
        }
        if(!req.body.status){
            err.status="Status required !!"
        }
        return {
            err:err,
            isValid:Object.keys(err).length===0
        }  
    }
}