const users=[]
const addUser= ({id , name , email , type, location})=>{
    let existing =users.find(user=>{
      if(email===user.email){
          return {message:"user exist"}
      }
    })
    if(!existing){
        const user = {id , name ,email, type, location}
        users.push(user)
        return {message:"user joinded"}
    }
    if(existing){
        return {message:"user exist"}
    }
    return users
}
const removeUser=(id)=>{
    
    let index =users.findIndex(element=>{
        element.id===id
    });

    users.splice(index , 1)
    return users

}
const getUser =(id)=>{
    users.find((user)=>{
        user.id===id
    })
}
module.exports={
    addUser, removeUser,getUser, users
}