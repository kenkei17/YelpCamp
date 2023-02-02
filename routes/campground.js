const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require("../utils/catchAsync");

const {isLoggedIn,isAuthor, validateCampground} = require('../middleware');

router.get('/',catchAsync(async(req,res)=>{
    const campgrounds= await Campground.find({});
  
    res.render('campgrounds/index', {campgrounds});
}));
router.get('/new', isLoggedIn,(req,res)=>{
    
    res.render("campgrounds/new");
});
router.post('/',isLoggedIn,validateCampground, catchAsync(async(req,res,next)=>{
        // if(!req.body.campground) throw new ExpressError('Invalid data ', 400)

       
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', "Successfully added a campground!");
        res.redirect(`/campgrounds/${campground._id}`);
 
    
}));
router.put('/:id',isLoggedIn,isAuthor, validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params;   
    
    const campground = await Campground.findByIdAndUpdate(id ,{...req.body.campground});
    req.flash('success', "Edited a campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));
router.delete('/:id', isLoggedIn, catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    if(!campground){
        req.flash('error', "Can't find that campground!");
        res.redirect('/campgrounds')
    }
    req.flash('success', "Deleted a campground!");
    res.redirect('/campgrounds');
}));
router.get('/:id', catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', "Can't find that campground!");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
}));
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(async(req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id);
    if(!campground){
        req.flash('error', "Can't find that campground!");
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
}));

module.exports = router;