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
const jwt = require('jsonwebtoken');
const config = require('../../config/database');


router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.json({ success: false, message: 'No token provided' });
  } else {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'Token invalid: ' + err });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
});


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
          userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
            if(err) {
              res.json({ success: false, message: err});
            } else {
              if(!user) {
                res.json({ success: false, message: 'Unable to authenticate user' });
              } else {
                res.json({ success: true, post: post });
                // if( user.username !== post.createdBy ) {
                //   res.json({ success: false, message: 'You are not authorized to edit this post' });
                // } else {
                // }
              }
            }
          });
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
              post.save((err, post) => {
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
                    if(!post) {
                      res.json({ success: false, message: 'Post was not found' });
                    } else {
                      res.json({ success: false, message: err });
                    }
                  }
                } else {
                  res.json({ success: true, message: 'Post saved!', post: post });
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

// Update post
router.put('/update-post', upload.any(), (req, res)=> {
  console.log(req.files.length);
  let updatePost = JSON.parse(req.body.post);
  if (!updatePost._id) {
    res.json({ success: false, message: 'No post ID was provided for /update-post/:id' });
  } else {
    postModel.findOne({ _id: updatePost._id }, (err, post)=> {
      if(err) {
        res.json({ success: false, message: 'Not a valid post ID'});
      } else {
        if (!post) {
          res.json({ success: false, message: 'Post ID was not found' });
        } else {
          userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
            if(err) {
              res.json({ success: false, message: err });
            } else {
              if(!user) {
                res.json({ success: false, message: 'Unable to authenticate user'});
              } else {
                if(user.username !== post.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this blog post' });
                } else {
                  if (req.files.length == 0) {
                    post.title = updatePost.title,
                    post.text = updatePost.text,
                    post.category = updatePost.category,
                    post.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err });
                      } else {
                        res.json({ success: true, message: 'Post updated!' });
                      }
                    });
                  } else {
                    post.title = updatePost.title,
                    post.image = req.files[0].originalname,
                    post.text = updatePost.text,
                    post.category = updatePost.category,
                    post.save((err) => {
                      if (err) {
                        res.json({ success: false, message: err });
                      } else {
                        res.json({ success: true, message: 'Post updated!' });
                      }
                    });
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

router.delete('/delete-post/:id', (req, res)=> {
  if(!req.params.id) {
    res.json({ success: false, message: 'No ID provided'});
  } else {
    postModel.findOne({ _id: req.params.id }, (err, post)=> {
      if(err) {
        res.json({ success: false, message: err });
      }else {
        if(!post) {
          res.json({ success: false, message: 'Post was not found' });
        } else {
          userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
            if(err) {
              res.json({ success: false, message: err });
            } else {
              if(!user) {
                res.json({ success: false, message: 'Unable to authenticate user' });
              } else {
                if(user.username !== post.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to delete this blog post' });
                }else {
                  post.remove((err)=> {
                    if(err) {
                      res.json({ success: false, message: err});
                    } else {
                      res.json({ success: true, message: 'Post deleted!'});
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
});

// Post like
router.put('/likePost', (req, res)=> {
  if(!req.body.id) {
    res.json({ success: false, message: 'No ID was provided' });
  } else {
    postModel.findOne({ _id: req.body.id}, (err, post)=> {
      if(err) {
        res.json({ success: false, message: err });
      } else {
        if(!post) {
          res.json({ success: false, message: 'That post was not found' });
        } else {
          userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
            if(err) {
              res.json({ success: false, message: err });
            } else {
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
              } else {
                if ( user.username == post.createdBy ) {
                  res.json({ success: false, message: 'You can not rate your Posts' });
                } else {
                  if (post.likedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already liked this post' });
                  } else {
                    if (post.dislikedBy.includes(user.username)) {
                      post.dislikes--;
                      const arrayIndex = post.dislikedBy.indexOf(user.username);
                      post.dislikedBy.splice(arrayIndex, 1);
                      post.likes++;
                      post.likedBy.push(user.username);
                      post.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong' });
                        } else {
                          res.json({ success: true, message: 'Post liked!' });
                        }
                      });
                    } else {
                      post.likes++;
                      post.likedBy.push(user.username);
                      post.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong' });
                        } else {
                          res.json({ success: true, message: 'Post liked!' });
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

// Dislike post
router.put('/dislikePost', (req, res)=> {
  if(!req.body.id) {
    res.json({ success: false, message: 'No ID was provided' });
  } else {
    postModel.findOne({ _id: req.body.id}, (err, post)=> {
      if(err) {
        res.json({ success: false, message: err });
      } else {
        if(!post) {
          res.json({ success: false, message: 'That post was not found' });
        } else {
          userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
            if(err) {
              res.json({ success: false, message: err });
            } else {
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' });
              } else {
                  if ( user.username == post.createdBy ) {
                    res.json({ success: false, message: 'You can not rate your Posts' });
                  } else {
                    if (post.dislikedBy.includes(user.username)) {
                      res.json({ success: false, message: 'You already disliked this post' });
                    } else {
                      if (post.likedBy.includes(user.username)) {
                        post.likes--;
                        const arrayIndex = post.likedBy.indexOf(user.username);
                        post.likedBy.splice( arrayIndex, 1 );
                        post.dislikes++;
                        post.dislikedBy.push(user.username);
                        post.save((err)=> {
                          if(err) {
                            res.json({ success: false, message: 'Something went wrong' });
                          } else {
                            res.json({ success: true, message: 'Post disliked!'});
                          }
                        });
                      } else {
                        post.dislikes++;
                        post.dislikedBy.push(user.username);
                        post.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong' });
                          } else {
                            res.json({ success: true, message: 'Post disliked!' });
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

router.post('/add-comment', (req, res)=> {
  if(!req.body.comment) {
    res.json({ success: false, message: 'No comment provided'});
  } else {
    if(!req.body.id) {
      res.json({ success: false, message: 'No ID was provided' });
    } else {
      postModel.findOne({ _id: req.body.id }, (err, post)=> {
        if(err) {
          res.json({ success: false, message: 'Invalid post ID' });
        } else {
          if(!post) {
            res.json({ success: false, message: 'Post not found!'});
          } else {
            userModel.findOne({ _id: req.decoded.userId }, (err, user)=> {
              if(err) {
                res.json({ success: false, message: err });
              } else {
                if(!user) {
                  res.json({ success: false, message: 'Could not authenticate user'});
                } else {
                  post.comments.push({
                    comment: req.body.comment.comment,
                    commentCreatedAt: req.body.comment.commentCreatedAt,
                    commentatorFirstname: user.firstname,
                    commentatorLastname: user.lastname,
                    commentatorAvatar: user.avatar,
                  });
                  post.save((err)=> {
                    if(err) {
                      res.json({ success: false, message: err });
                    } else {
                      res.json({ success: true, message: 'Comment saved!' });
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
});

router.post('/reply-comment', (req, res)=> {
  if(!req.body.replyComment) {
    res.json({ success: false, message: 'No reply comment provided'});
  } else {
    if(!req.body.postId) {
      res.json({ success: false, message: 'Not found post ID'});
    } else {
      if (req.body.commentIndex === undefined) {
        res.json({ success: false, message: 'Not found comment' });
      } else {
        postModel.findOne({ _id: req.body.postId }, (err, post) => {
          if (err) {
            res.json({ success: false, message: 'Something went wrong' });
          } else {
            if (!post) {
              res.json({ success: false, message: 'Invalid post ID' });
            } else {
              userModel.findOne({ _id: req.decoded.userId }, (err, user) => {
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' });
                } else {
                  if (!user) {
                    res.json({ success: false, message: 'Could not authenticate user' });
                  } else {
                    const replyComment = {
                      replyComment: req.body.replyComment.comment,
                      replyCommentCreatedAt: req.body.replyComment.commentCreatedAt,
                      replyCommentatorFirstname: user.firstname,
                      replyCommentatorLastname: user.lastname,
                      replyCommentatorAvatar: user.avatar,
                    }                
                    post.comments[req.body.commentIndex].replyComments.push(replyComment);
                    post.save((err)=> {
                      if(err) {
                        res.json({ success: false, message: err });
                      } else {
                        res.json({ success: true, message: 'Relply saved!'});
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  }
});


router.get('/search-posts', (req, res)=> {
  postModel.find({}, (err, posts)=> {
    if(err) {
      res.json({ err: err });
    } else {
      let result = [];
      let matchResult = [];
      let query = req.query.title
      var regexp = new RegExp("\\b" + query + "\\w*\\b", "gi");

      for (let i = 0; i < posts.length; i++) {
        matchResult.push(posts[i].title.match(regexp));
      }
      
      for (let i = 0; i < matchResult.length; i++) {
        if ( matchResult[i] !== null ) {
          result.push(posts[i]);
        }
      }
      res.json({ posts: result });
    }
  })
});

module.exports = router;
