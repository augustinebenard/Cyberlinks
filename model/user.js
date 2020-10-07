const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt-nodejs"); // A native JS bcrypt library for NodeJS

const Schema = mongoose.Schema;

// Validate Function to check e-mail length
let emailLengthChecker = (email) => { // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else { // Check the length of e-mail string
        if (email.length < 5 || email.length > 50) {
            return false; // Return error if not within proper length
        } else {
            return true; // Return as valid e-mail
        }
    }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => { // Check if e-mail exists
    if (!email) {
        return false; // Return error
    } else { // Regular expression to test for a valid e-mail
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email); // Return regular expression test results (true or false)
    }
};

// Array of Email Validators
const emailValidators = [
    // First Email Validator
    {
        validator: emailLengthChecker,
        message: "E-mail must be at least 5 characters but no more than 50"
    },
    // Second Email Validator
    {
        validator: validEmailChecker,
        message: "Must be a valid e-mail"
    },
];

// Validate Function to check username length
let usernameLengthChecker = (username) => { // Check if username exists
    if (!username) {
        return false; // Return error
    } else { // Check length of username string
        if (username.length < 3 || username.length > 15) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid username
        }
    }
};

// Validate Function to check if valid username format
let validUsername = (username) => { // Check if username exists
    if (!username) {
        return false; // Return error
    } else { // Regular expression to test if username format is valid
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username); // Return regular expression test result (true or false)
    }
};

// Array of Username validators
const usernameValidators = [
    // First Username validator
    {
        validator: usernameLengthChecker,
        message: "Username must be at least 3 characters but no more than 15"
    },
    // Second username validator
    {
        validator: validUsername,
        message: "Username must not have any special characters"
    },
];

// Validate Function to check password length
let passwordLengthChecker = (password) => { // Check if password exists
    if (!password) {
        return false; // Return error
    } else { // Check password length
        if (password.length < 8 || password.length > 35) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// Validate Function to check if valid password format
let validPassword = (password) => { // Check if password exists
    if (!password) {
        return false; // Return error
    } else { // Regular Expression to test if password is valid format
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password); // Return regular expression test result (true or false)
    }
};

// Array of Password validators
const passwordValidators = [
    // First password validator
    {
        validator: passwordLengthChecker,
        message: "Password must be at least 8 characters but no more than 35"
    },
    // Second password validator
    {
        validator: validPassword,
        message: "Must have at least one uppercase, lowercase, special character, and number"
    },
];

// User Model Definition
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    // profilePic: {
    //     type: String
    // },
    profileUrl: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: emailValidators
    },

    username: {
        type: String,
        required: true,
        unique: true,
        validate: usernameValidators
    },
    password: {
        type: String,
        required: true,
        unique: true,
        validate: passwordValidators
    },
    description: {
        type: String,
        default: "tell us about yourself"
    },
    phone: {
        type: Number,
        default: 08000000000
    },
    education: {
        type: Array,
        default: "Which school do you attend or graduated from"
    },
    interest: {
        type: Array,
        default: "We love to know about your hobbies"
    },
    address: {
        type: String,
        default: "xxxx"
    },
    city: {
        type: String,
        default: "xxxx"
    },
    country: {
        type: String,
        default: "xxxx"
    }
});

// Schema Middleware to Encrypt Password
userSchema.pre("save", function (next) { // Ensure password is new or modified before applying encryption
    if (!this.isModified("password")) 
        return next();
    


    // Apply encryption
    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) 
            return next(err);
        


        // Ensure no errors
        this.password = hash; // Apply encryption to password
        next(); // Exit middleware
    });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

module.exports = mongoose.model("User", userSchema);
