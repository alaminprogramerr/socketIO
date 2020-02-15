const DistanceMapper = require('geo-distance')

module.exports=(users, postManLocation, distanceInKm)=>{
    let sendAbleUser=[] 
      users.forEach(user=>{
        let distance=  DistanceMapper.between(postManLocation, user.location).human_readable();
        if(user.type=='provider'|| user.type=='Provider' ){
          if(distanceInKm >distance.distance ){
            sendAbleUser.push(user)
            console.log('pushed done')
          }
        }
      })
    return sendAbleUser
}