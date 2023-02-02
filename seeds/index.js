const mongoose = require('mongoose');
const Campground = require('../models/campground');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const {descriptors, places} = require('./seedHelpers');
const cities = require('./cities')

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Connection Established");
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 60; i ++){
        const random1000 = Math.floor(Math.random() *1000);
        const random100 = Math.floor(Math.random() *100)+ 100;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location : `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`https://source.unsplash.com/collection/3671${random100}`,
            author: "63db47a222587f1c8e0fcd80",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos fuga eaque eveniet accusamus praesentium rem perspiciatis amet voluptates obcaecati asperiores esse sed voluptatum ipsam, placeat quia repudiandae enim impedit reprehenderit.",
            price
        });
        await camp.save();
    }
}
seedDB().then(()=>{
    db.close();
});