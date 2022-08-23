const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelper')
const Campground = require('../models/campground')
 
main()
.then(()=>console.log("MONGO CONNECTION OPEN"))
.catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/camps-engine',{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
  });
}
const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<800;i++){
        const random1000 = Math.floor(Math.random()*200);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '62f8e96b99e85227a086ef2d',
            location: `${cities[random1000].name},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ducimus nobis recusandae veniam quas perferendis excepturi? Molestiae consequatur suscipit consequuntur et mollitia officiis excepturi nemo dolore, neque corrupti. Rem, commodi.',
            price,
            geometry:{
                type:"Point",
                coordinates:[
                  cities[random1000].longitude,
                  cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/camps-engine/image/upload/v1660965704/CampsEngine/tree-ga038aa3f8_1280_hbdrus.jpg',
                  filename: 'CampsEngine/li1j2gbwuzxuobfx417m'
                },
                {
                  url: 'https://res.cloudinary.com/camps-engine/image/upload/v1660965705/CampsEngine/airstream-ge35d3718b_1920_vgexcx.jpg',
                  filename: 'CampsEngine/rjtz7qywtbm7iytqtf2j'
                },
                {
                  url: 'https://res.cloudinary.com/camps-engine/image/upload/v1660965796/CampsEngine/pexels-matheus-bertelli-7510677_dn42pe.jpg',
                  filename: 'CampsEngine/j0rhfpfbmbtwb6y3i1z0'
                }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})