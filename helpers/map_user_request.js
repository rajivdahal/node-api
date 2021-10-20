module.exports=function(userdata,user){
    if(userdata.username)  
    user.username=userdata.username     
if(userdata.email)  
    user.email=userdata.email
if(userdata.name)  
    user.name=userdata.name       
if(userdata.password)  
    user.password=userdata.password   
if(userdata.phoneNumber)  
    user.phoneNumber=userdata.phoneNumber   

    
if(userdata.permanentAddress || userdata.temporaryAddress && !user.address)
    user.address={}
if(userdata.permanentAddress)  
    user.address.permanentAddress=userdata.permanentAddress   
if(userdata.temporaryAddress)  
    user.address.temporaryAddress=userdata.temporaryAddress.split(',')   


if(userdata.gender)  
    user.gender=userdata.gender   
if(userdata.dob)  
    user.dob=userdata.dob   
if(userdata.country)  
    user.country=userdata.country   
if(userdata.image)  
    user.image=userdata.image   
if(userdata.role)  
    user.role=userdata.role   
if(userdata.isArchived)  
    user.isArchived=true
if(userdata.setisArchivedFalse)  
    user.isArchived=false        
if(userdata.status)  
    user.status=userdata.status  

return user    


}