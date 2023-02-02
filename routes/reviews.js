const express = require('express');
const router = express.Router({mergeParams:true});

const {reviewSchema} = require('../schemas.js');

const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');

const Review = require('../models/review');
const Campground = require('../models/campground');
const {isLoggedIn,validateReview} = require('../middleware');


router.post('/',validateReview,isLoggedIn, catchAsync(async(req,res)=>{
    console.log(req.params);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success', "successfully added a review")
    res.redirect(`/campgrounds/${campground._id}`);

}));
router.delete('/:reviewId',isLoggedIn, catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id ,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review Deleted")
    res.redirect(`/campgrounds/${id}`);
}));



module.exports = router;