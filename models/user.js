var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")
;

var UserSchema = new mongoose.Schema ({
   username: String,
   password: String,
   email: String,
   resetPasswordToken: String,
   resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);