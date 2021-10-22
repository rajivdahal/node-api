const mongodb=require('mongodb')
const mongoose=require('mongoose')
const dbName="group37db"
const conxnURL="mongodb://localhost:27017"+'/'+dbName

mongoose.connect(conxnURL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
},
function(err,done){
    if(err){
        return console.log("error in db connectionn")
    } 
    console.log("db connection successful at port 27017")
}
)