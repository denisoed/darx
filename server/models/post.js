const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Text validator
let titleLegthCkecker = (title) => {
  if(!title) {
    return false;
  } else {
    if(title.length < 5 || title.legth > 50) {
      return false;
    } else {
      return true;
    }
  }
}

let titleValidators = [{
  validator: titleLegthCkecker,
  message: 'Title must be more than 5 characters but no more than 50'
}];

// Text Validator
let textLegthCkecker = (text) => {
  if(!text) {
    return false;
  } else {
    if(text.length < 5 || text.legth > 2000) {
      return false;
    } else {
      return true;
    }
  }
}

let textValidators = [{
  validator: textLegthCkecker,
  message: 'Text must be more than 5 characters but no more than 2000'
}];

//Comment validator
let commentLegthChecker = (comment) => {
  if(!comment[0]) {
    return false;
  } else {
    if (comment[0].length < 1 || comment[0].length > 200) {
      return false;
    } else {
      return true;
    }
  }
} 

let commentValidators = [{
  validator: commentLegthChecker,
  message: 'Comments may not exceed 200 characters.'
}];

let month = () => {
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  let date = new Date();

  return monthNames[date.getMonth()];
}

mongoose.Promise = global.Promise;
const PostSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  text: { type: String, required: true, validate: textValidators },
  createdBy: { type: String, required: true },
  createdAt: {
    fullDate: { type: Date, default: Date.now() },
    month: { type: String, default: month() }
  },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array},
  dislikes: { type: Number, default: 0 },
  dislikedBy: { type: Array},
  comments: [{
      comment: { type: String, validate: commentValidators },
      commentator: { type: String } 
  }]
});

module.exports = mongoose.model('Post', PostSchema);