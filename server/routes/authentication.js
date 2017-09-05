const express = require('express');
const router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/src/assets/img/avatars/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

const userModel = require('../models/user');
const jwt = require('jsonwebtoken'); 
const config = require('../../config/database');

router.get('/', (req, res) => {
    res.send('Authentication working!');
});

router.post('/register', upload.any(), (req, res) => {
    let newUser = JSON.parse(req.body.user);

    if (!newUser.email) {
        res.json({ success: false, message: "You must provide an email address" })
    } else {
        if (!newUser.username) {
            res.json({ success: false, message: "You must provide a username" })
        } else {
            if (!newUser.password) {
                res.json({ success: false, message: "You must provide a password" })
            } else {
                if(!newUser.securityQuestion) {
                    res.json({ success: false, message: "You must provide a security question" })
                } else {
                    if (!newUser.firstname) {
                        res.json({ success: false, message: "You must provide a firstname" })
                    } else {
                        if (!newUser.lastname) {
                            res.json({ success: false, message: "You must provide a lastname" })
                        } else {
                            if(!newUser.gender) {
                                res.json({ success: false, message: "You must provide a gender" })
                            }else {
                                // Save User
                                let user = new userModel({
                                    email: newUser.email.toLowerCase(),
                                    username: newUser.username,
                                    password: newUser.password,
                                    securityQuestion: newUser.securityQuestion,
                                    firstname: newUser.firstname,
                                    lastname: newUser.lastname,
                                    aboutme: newUser.aboutme,
                                    gender: newUser.gender,
                                    avatar: req.files[0].originalname,
                                    birthday: {
                                        day: newUser.birthday.day,
                                        month: newUser.birthday.month,
                                        year: newUser.birthday.year
                                    },
                                    address: newUser.address,
                                    state: newUser.state,
                                    phone: newUser.phone
                                });
                                user.save((err) => {
                                    if (err) {
                                        if (err.code === 11000) {
                                            res.json({ success: false, message: "Username or email already exists" });
                                        } else {
                                            if (err.errors) {
                                                if (err.errors.email) {
                                                    res.json({ success: false, message: err.errors.email.message });
                                                } else {
                                                    if (err.errors.username) {
                                                        res.json({ success: false, message: err.errors.username.message });
                                                    } else {
                                                        if (err.errors.password) {
                                                            res.json({ success: false, message: err.errors.password.message });
                                                        } else {
                                                            if (err.errors.securityQuestion) {
                                                                res.json({ success: false, message: err.errors.securityQuestion.message });
                                                            } else {
                                                                if (err.errors.firstname) {
                                                                    res.json({ success: false, message: err.errors.firstname.message });
                                                                } else {
                                                                    if (err.errors.lastname) {
                                                                        res.json({ success: false, message: err.errors.lastname.message });
                                                                    } else {
                                                                        if(err.errors.gender) {
                                                                            res.json({ success: false, message: err.errors.gender.message });
                                                                        } else {
                                                                            res.json({ success: false, message: err`` });
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            } else {
                                                res.json({ success: false, message: "Could not save user. Error: ", err });
                                            }
                                        }
                                    } else {
                                        res.json({ success: true, message: "Registration completed successfully!" });
                                    }
                                });
                               ///////  Save user end ///////
                            }
                        }
                    }  
                }
            }
        }
    }
});

router.get('/checkEmail/:email', (req, res) => {
    if (!req.params.email) {
        res.json({ success: false, message: 'Email was not provided' });
    } else {
        userModel.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (user) {
                    res.json({ success: false, message: 'Email is already taken' });
                } else {
                    res.json({ success: true, message: 'Email is available' });
                }
            }
        });
    }
});

router.get('/checkUsername/:username', (req, res) => {
    if (!req.params.username) {
        res.json({ success: false, message: 'Username was not provided' });
    } else {
        userModel.findOne({ username: req.params.username }, (err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (user) {
                    res.json({ success: false, message: 'Username is already taken' });
                } else {
                    res.json({ success: true, message: 'Username is available' });
                }
            }
        });
    }
});

router.post('/login', (req, res) => {
    if (!req.body.email) {
        res.json({ success: false, message: 'No email was provided' });
    } else {
        if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided' });
        } else {
            userModel.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Email not found!' });
                    } else {
                        const validPassword = user.comparePassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Password invalid' });
                        } else {
                            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                            res.json({ success: true, message: 'Authorization completed successfully!', token: token, user: { email: user.email } });
                        }
                    }
                }
            });
        }
    }
});

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

router.get('/profile', (req, res) => {
    userModel.findOne({ _id: req.decoded.userId }, (err, user) => {
        if (err) {
            res.json({ success: false, message: err });
        } else {
            if (!user) {
                res.json({ success: false, message: 'User not found' });
            } else {
                res.json({ success: true, user: user });
            }
        }
    });
});

module.exports = router;