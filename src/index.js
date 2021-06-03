const path = require("path");
const express = require("express");
require("./db/mongoose");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const hbs = require('hbs')
const cookieParser = require('cookie-parser');
require('./telegram.js')
const {sendRegisterDone} = require('./telegram.js')
const app = express();


const deviceRouter = require("./routers/device");
const devicesRouter = require("./routers/devices");
const dataRouter = require("./routers/data");
const wardRouter = require("./routers/ward");
const userRouter = require('./routers/user')
const wearableRouter = require('./routers/wearable')

// Setting Up hbs engine
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views,partials location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
app.use(express.static(publicDir))

hbs.registerPartials(partialsPath)
// method override middleware
app.use(methodOverride('_method'))
// cookie Parser for tokens
app.use(cookieParser());
// Setting port
const port = process.env.PORT || 3000;


//bodyParser MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Using routers
app.use(deviceRouter);
app.use(devicesRouter);
app.use(dataRouter);
app.use(wardRouter);
app.use(userRouter);
app.use(wearableRouter);

app.get('/', (req,res) => {
    res.render('index', {layout: 'layouts/main'
    })
})
app.get('*', (req,res)=>{
    res.render('404',{
        message:'Page not found',
        title:'ERROR 404'
    })
})
app.listen(process.env.PORT, () => {
	console.log("Server is up on", process.env.PORT);
});
