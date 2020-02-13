if(process.env.NODE_ENV == "production"){
    //connection to cloud mongodb server
    module.exports = {
    mongoURI:"mongodb+srv://joel:joel@cluster0-jolod.mongodb.net/test?retryWrites=true&w=majority"
    }
}
else{
    module.exports = {
        mongoURI:"mongodb://localhost:27017/gamelibrary"
    }
}