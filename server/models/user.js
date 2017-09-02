const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Email validate
let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else {
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

const emailValidators = [{
        validator: emailLengthChecker,
        message: 'Email must be at least 5 characters but no more then 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid email'
    }
];

// Username validate
let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [{
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more then 15'
    },
    {
        validator: validUsername,
        message: 'Username must not any have special characters'
    }
];

// Password validate
let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else {
        if (password.length < 3 || password.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

const passwordValidators = [{
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more then 35'
    },
    {
        validator: validPassword,
        message: 'Must have all least one uppercase, lowercase, special characters, and number'
    }
];

let firstnameLengthChecker = (firstname) => {
    if (!firstname) {
        return false;
    } else {
        if (firstname.length < 3 || firstname.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

const firstnameLengthValidators = [{
    validator: firstnameLengthChecker,
    message: 'Firstname must be at least 1 characters but no more then 15'
}];

let lastnameLengthChecker = (lastname) => {
    if (!lastname) {
        return false;
    } else {
        if (lastname.length < 3 || lastname.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

const lastnameLengthValidators = [{
    validator: lastnameLengthChecker,
    message: 'Lastname must be at least 1 characters but no more then 15'
}];

let securityQuestionLengthChecker = (securityQuestion) => {
    if (!securityQuestion) {
        return false;
    } else {
        if (securityQuestion.length < 3 || securityQuestion.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

const securityQuestionLengthValidators = [{
    validator: securityQuestionLengthChecker,
    message: 'SecurityQuestion must be at least 1 characters but no more then 15'
}];

mongoose.Promise = global.Promise;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators },
    securityQuestion: { type: String, required: true, validate: securityQuestionLengthValidators },
    firstname: { type: String, required: true, validate: firstnameLengthValidators },
    lastname: { type: String, required: true, validate: lastnameLengthValidators },
    gender: { type: String, required: true },
    aboutme: { type: String },
    avatar: { type: String },
    birthday: {
        day: { type: Number },
        month: { type: String },
        year: { type: Number }
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    })
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);