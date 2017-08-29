const express = require('express');
const router = express.Router();
const postModel = require('../models/post');


// Get all post
router.get('/all-posts', (req, res) => {
  postModel.find({}, (err, posts) => {
    if(err) {
      res.json({ success: false, message: err});
    } else{
      if(!posts) {
        res.json({ success: false, message: 'Post not found'});
      } else {
        res.json({ success: true, posts: posts });
        console.log(posts);
      }
    } 
  }).sort({ '_id': -1 });
})

// Add add post
router.post('/add-post', (req, res) => {
  if(!req.body.title) {
    res.json({ success: false, message: 'Title is required' });
  } else{
    if(!req.body.text) {
      res.json({ success: false, message: 'Text is required' });
    } else {
      if (!req.body.createdBy) {
        res.json({ success: false, message: 'Author the post is required' });
      } else {
        let post = new postModel({
          title: req.body.title,
          text: req.body.text,
          createdBy: req.body.createdBy
        });
        post.save((err) => {
          if(err) {
            if(err.errors) {
              if(err.errors.title) {
                res.json({ success: false, message: err.errors.title.message });
              } else {
                if (err.errors.text) {
                  res.json({ success: false, message: err.errors.text.message });
                } else {
                  if (err.errors.comments.comment) {
                    res.json({ success: false, message: err.errors.comments.comment.message });
                  } else {
                    res.json({ success: false, message: err });
                  } 
                }
              }
            } else {
              res.json({ success: false, message: err});
            }
          } else {
            res.json({ success: true, message: 'Post saved!'});
          }
        })
      }
    }
  } 
});

module.exports = router;
