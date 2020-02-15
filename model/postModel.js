const mongose = require ('mongoose')
const Schema= mongose.Schema

const  postScema= new Schema({
    title:{
        type:String,
        // required:true
    },
    description:{
        type:String,
        // required:true
    },
    postCreator:{
        type:Object,
        // required:true
    },
    providerId:{
        type:String,
        // required:true
    },
    createdAt:{
        type:String,
        // required:true
    },
    status:{
        type:String,
        // required:true
    }

})

const postModel = mongose.model('postModel' , postScema)
module.exports= postModel