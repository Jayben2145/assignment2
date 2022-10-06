const express = require('express');
var bird_controller = require('../controllers/bird_controller');
const os = require("os");
const Bird = require(os.homedir()+'/cosc203-asgn2-start/models/bird.js')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

/* create a router (to export) */
const router = express.Router();
router.use(fileUpload());
router.use(bodyParser.urlencoded({ extended: false }))

/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    try {
        const search = req.query.search;
        const status = req.query.status;
        const sort = req.query.sort;
        bird_controller.filter_bird_data(search, status, sort).then(x => { 
            res.render('home', {
                birds: x
            });
        });
      } catch (error) {
        res.render('404-not-found')
      }
      
   

    // render the Pug template 'home.pug' with the filtered data
})

// TODO: finishe the "Create" route(s)
router.get('/create', (req, res) => {
    // currently does nothing except redirect to home page
    res.render('create-bird');
});

router.post('/createNew', async (request, response) => {
    let sampleFile;
    let uploadPath;
    const id = request.body.id;
    let birdImgName
    if(request.files){
         birdImgName=request.files.photo_upload.name;
         sampleFile = request.files.photo_upload;
         uploadPath =os.homedir()+'/cosc203-asgn2-start/public/images/' + sampleFile.name;
          sampleFile.mv(uploadPath, function(err) {
             if (err)
               return response.status(500).send(err);
           });
    }
    else{
         birdImgName=request.body.photo_source;
    }
            const bird={primary_name: request.body.primary_name ,
            english_name: request.body.english_name ,
            scientific_name: request.body.scientific_name ,
            order: request.body.order ,
            family: request.body.family ,
            other_names: request.body.other_names ,
            status: request.body.status ,
            photo:{credit:request.body.photo_credit,source:birdImgName} ,
            size: {length:{value:request.body.length, units:'cm'}, weight:{value:request.body.weight,units:'g'}}};

    const db_info = await Bird.create(bird);
    
    // print some stuff
    console.log(db_info, '/api/create-message response');
    

    // console.log(db_info, 'birds/edit-bird, response');
    response.redirect('/birds/'); 
})




router.post('/edit-bird', async (request, response) => {
    let sampleFile;
    let uploadPath;
    const id = request.body.id;
    let birdImgName
    if(request.files){
         birdImgName=request.files.photo_upload.name;
         sampleFile = request.files.photo_upload;
         uploadPath =os.homedir()+'/cosc203-asgn2-start/public/images/' + sampleFile.name;
          sampleFile.mv(uploadPath, function(err) {
             if (err)
               return response.status(500).send(err);
           });
    }
    else{
         birdImgName=request.body.photo_source;
    }
    size={length:{value:18, units:'cm'}, weight:{value:35,units:'g'}}

    const db_info = await Bird.updateOne(
        { _id: id},
        {$set:{primary_name: request.body.primary_name ,
            english_name: request.body.english_name ,
            scientific_name: request.body.scientific_name ,
            order: request.body.order ,
            family: request.body.family ,
            other_names: request.body.other_names ,
            status: request.body.status ,
            photo:{credit:request.body.photo_credit,source:birdImgName} ,
            size: {length:{value:request.body.length, units:'cm'}, weight:{value:request.body.weight,units:'g'}}}});

    

    // console.log(db_info, 'birds/edit-bird, response');
    response.redirect('/birds/'); 
})

// TODO: get individual bird route(s)
router.get('/:id/', async (req, res) => {
    const id = req.params.id;
    let bird = await bird_controller.getBirdById(id);
    if(bird==null){
        res.render('404-not-found')  
    }
    else{
    res.render('bird-view',{ data: bird });
    }

});
// TODO: Update bird route(s)
router.get('/:id/update', async (req, res) => {
        const id = req.params.id;
        let bird = await bird_controller.getBirdById(id)
        if(bird==null){
            res.render('404-not-found')
        }
        else{
            res.render('bird-update',{ data: bird });
        }
});


// TODO: Delete bird route(s)
router.post('/:id/delete-message', async (request, response) => {
    const id = request.params.id;
    const db_info = await Bird.findOneAndRemove({ _id: id })
    response.redirect('/birds/');
})

router.get( '/birds/*', (request, response) => {
    res.render('404-not-found')
});

module.exports = router; // export the router