require('dotenv').config()

const app = require('./src/app.js');
const { ConnectDB } = require('./src/config/db.config.js');

const PORT = process.env.port || 4500;

app.listen(PORT, ()=>{
    console.log(`Server is listening at port ${PORT}`)
    ConnectDB()
})