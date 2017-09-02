const express = require('express');
const router = express.Router();
const postModel = require('../models/post');
const userModel = require('../models/user');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/src/assets/img/posts/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })



// Get all post
router.get('/all-posts', (req, res) => {
  postModel.find({}, (err, posts) => {
    if(err) {
      res.json({ success: false, message: err});
    } else{
      if(!posts) {
        res.json({ success: false, message: 'Posts not found'});
      } else {
        res.json({ success: true, posts: posts });
      }
    } 
  }).sort({ '_id': -1 });
})

// Get post by id
router.get('/single-post/:id', (req, res) => {
  if(!req.params.id) {
    res.json({ success: false, message: 'No post ID was provided for /single-post/:id'});
  } else {
    postModel.findOne({ _id: req.params.id }, (err, post) => {
      if(err) {
        res.json({ success: false, message: 'Not a valid post ID' });
      } else {
        if (!post) {
          res.json({ success: false, message: 'Post not found' });
        } else {
          res.json({ success: true, post: post });
        }
      }
    });
  }
});

// Add add post
router.post('/add-post', upload.any(), (req, res) => {
  let newPost = JSON.parse(req.body.post);

  if(!newPost.foreignKey) {
    res.json({ success: false, message: 'Post ID is required'});
  } else{
    if (!newPost.title) {
      res.json({ success: false, message: 'Title is required' });
    } else {
      if (!newPost.text) {
        res.json({ success: false, message: 'Text is required' });
      } else {
        if(req.files.length == 0) {
          res.json({ success: false, message: 'Image Post is required' });
        }else {
          if (!newPost.category) {
            res.json({ success: false, message: 'Category is required' });
          } else {
            if (!newPost.createdBy) {
              res.json({ success: false, message: 'Author the post is required' });
            } else {
              let post = new postModel({
                foreignKey: newPost.foreignKey,
                title: newPost.title,
                text: newPost.text,
                image: req.files[0].originalname,
                category: newPost.category,
                createdBy: newPost.createdBy
              });
              post.save((err) => {
                if (err) {
                  if (err.errors) {
                    if (err.errors.foreignKey) {
                      res.json({ success: false, message: err.errors.foreignKey.message });
                    } else {
                      if (err.errors.title) {
                        res.json({ success: false, message: err.errors.title.message });
                      } else {
                        if (err.errors.text) {
                          res.json({ success: false, message: err.errors.text.message });
                        } else {
                          if(err.errors.image) {
                            res.json({ success: false, message: err.errors.image.message });
                          } else {
                            if (err.errors.category) {
                              res.json({ success: false, message: err.errors.category.message });
                            } else {
                              if (err.errors.comments.comment) {
                                res.json({ success: false, message: err.errors.comments.comment.message });
                              } else {
                                res.json({ success: false, message: err });
                              }
                            }
                          }
                        }
                      }
                    }
                  } else {
                    res.json({ success: false, message: JSON.stringify(err) });
                  }
                } else {
                  res.json({ success: true, message: 'Post saved!' });
                }
              });
            }
          }
        }
      }
    } 
  }
});

router.get('/user-posts/:id', (req, res)=> {
  if(!req.params.id) {
    res.json({ success: false, message: 'No post ID was provided for /user-posts/:id' });
  } else {

    postModel.find({ foreignKey: req.params.id }, (err, posts)=> {
      if(err) {
        res.json({ success: false, message: err });
      } else {
        if(!posts) {
          res.json({ success: false, message: 'Posts not found!' });
        } else {
          res.json({ success: true, posts: posts });
        }
      }
    });

  }
});

module.exports = router;
