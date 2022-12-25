const express = require('express');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://RahulSinghDhek:IQpy326QQQKAkK2J@cluster0.dxzlfnc.mongodb.net/ProeliumDB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);


app.listen(  3000, function () {
    console.log('Express app running on port ' + ( 3000))
});