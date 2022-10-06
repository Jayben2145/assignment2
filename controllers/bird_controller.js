const { bird_sort, search_string } = require('./bird_utils.js');
const os = require("os");
const Bird = require(os.homedir()+'/cosc203-asgn2-start/models/bird.js')
// const birds=require('./api/all-birds');


// get all birds (filtered)
async function filter_bird_data(search, status, sort) {
    // var results = birds;
        var results= await Bird.find({});
        if (status !== undefined && status !== "All") {
            results = results.filter((b) => b.status == status);
        }
        // filter by search string
        if (search !== undefined && search !== "") {
            results = search_string(results, search);
        }
        // sort by
        if (sort !== undefined) {
            results = bird_sort(results, sort);
        }
        return results;

}

async function getBirds(){
    var results= await Bird.find({});
    return results;
}

async function getBirdById(id){
    var birds= await Bird.find({});
    birds = birds.filter((b) => b._id == id);
    return birds[0];
}


module.exports = { filter_bird_data,getBirds,getBirdById };