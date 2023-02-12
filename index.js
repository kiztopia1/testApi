// Add Express
const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
// Initialize Express
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const Bot = require('./models/bot');
const Shot = require('./models/image')




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// multer setup
const storage   = multer.diskStorage({
  destination: "../../tmp",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage:storage
}).single("testImage");

// body parser for the post requests
app.use(bodyParser.urlencoded({ extended: true }));

// Create GET request
app.get("/", (req, res) => {
  res.send("Express s ");
});

// addBot
app.post('/addBot/:id', function(req, res) {
  const id = req.params.id ;
  const name = req.body.name
  
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(dbRes => {
      const bot = new Bot({
        id: id, 
        name: req.body.name,
        command: 'echo active',
        response: ''
    })
    bot.save()
    .then(bot => {
      
      res.send("success");
  })
    })
    
  }
   connect();

  
  
});

// add command
app.post('/addCommand/:id', function(req, res, next) {
  const id = req.params.id ;
  console.log(id)

  console.log(req.body.command)
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(dbRes => {
      Bot.findOneAndUpdate({id: id}, {command: req.body.command})
  .then(response => {

      res.send("success");
  })

    })
    
  }
   connect();

  
});

// addResponse
app.post('/addResponse/:id', function(req, res, next) {
  const id = req.params.id ;
  let txt = ''
  upload(req, res, (err) => {
    if(err){
      console.log(err)
    }else{
      async function connect() {
    
        fs.readFile(path.join(__dirname + '../../../tmp/' + req.file.filename), 'utf8', function(err, data) {
          if (err) throw err;
          txt = data
        });
        console.log(txt)
        await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
        .then(dbRes => {
          Bot.findOneAndUpdate({id: req.params.id},{
            response:txt
            
          })
          
          .then(image => {
            console.log('added')
            
            res.send("success!")
          })
        })
        
      }
       connect();
    }

  })

  upload()


  // console.log(req.file)
  // async function connect() {
  //   await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
  //   .then(() => {
  //     Bot.findOneAndUpdate({id: id}, {response: req.body.response})
  // .then(() => {

  //   res.send("success");
  // })
  //   })
    
  // }
  //  connect();

  // res.end()
});

//bot
app.get('/bot/:id', function(req, res, next) {
  const id = req.params.id ;

  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
      Bot.findOne({id: id})
  .then(bot => {
    Shot.findOne({id: id})
  .then(shot => {
    console.log(shot.image.data.toString('base64'))
    res.render('bot',{ title: 'bot', "bot": bot , "image": shot});
    // te
  })
    
    })
    })
    
  }
   connect();

  
});

//bots
app.get('/bots', function(req, res, next) {
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
      Bot.find()
  .then(bots => {
    res.render('bots',{ title: 'bots', "bots": bots });
    // res.send(bots)
  })
    })
    
  }
   connect();

 
});


// getCommands
app.get('/getCommand/:id', function(req, res, next) {
  const id = req.params.id ;
  
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
      Bot.findOne({id: id})
  .then(bot => {
    

    res.send(bot.command);
  })
    })
    
  }
   connect();

  
});

// getResponse
app.get('/getResponse/:id', function(req, res, next) {
  const id = req.params.id ;
  
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
      Bot.findOne({id: id})
  .then(bot => {
    
    res.send(bot.response);
  })
    })
  }
   connect();
});



// screenshot

// addShot
app.post('/addShot/:id', function(req, res) {
  upload(req, res, (err) => {
    if (err){
      console.log(err);
    }
    else{
      
  async function connect() {
    
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(dbRes => {
      const newImage = new Shot({
        id: req.params.id,
        name: req.body.name,
        image: {
          data: fs.readFileSync(path.join(__dirname + '../../../tmp/' + req.file.filename)),
          contentType: 'image/png'
        }
      })
      newImage.save()
      .then(image => {
        console.log('added')

        res.send("success!")
      })
    })
    
  }
   connect();

  }
})
  
  
});

// updateShot
app.post('/updateShot/:id', function(req, res) {
  upload(req, res, (err) => {
    if (err){
      console.log(err);
    }
    else{
      
  async function connect() {
    
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(dbRes => {
      Shot.findOneAndUpdate({id: req.params.id},{
        
        image: {
          data: fs.readFileSync(path.join(__dirname + '../../../tmp/' + req.file.filename)),
          contentType: 'image/png'
        }
      })
      
      .then(image => {
        console.log('added')
        
        res.send("success!")
      })
    })
    
  }
   connect();

  }
})
  
  
});


// getShot
app.get('/getShot/:id', function(req, res, next) {
  const id = req.params.id ;
  
  async function connect() {
    await mongoose.connect('mongodb+srv://shepherd:6322@cluster0.xow6jeh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
      Shot.findOne({id: id})
  .then(shot => {
    console.log(shot)
    res.send(shot);
  })
    })
  }
   connect();
});


// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
