import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
      username: {
            type: String,
            required: [true, 'Username is required'],
            unique: [true, 'Username must be unique']
      },
      firstName: {
            type: String,
            required: [true, 'First name is required'],
            minlength: [5, 'First name must be at least 5 characters long']
      },
      lastName: {
            type: String
      },
      mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
            validate: {
                  validator: function (v) {
                        return /^[0-9]{10}$/.test(v);
                  },
                  message: props => `${props.value} is not a valid mobile number!`
            }
      },
      email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email must be unique']
      },
      password: {
            type: String,
            required: [true, 'Password is required']
      },
      created: {
            type: Date,
            default : Date.now
      },
});

const User = mongoose.model('User', userSchema);

export default User;
