import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    authentication: {
        password: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        sessionToken: {
            type: String,
            select: false
        }
    }
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) => UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUser = (id: string) => UserModel.findOneAndDelete({_id: id}).then((user) => user.toObject());
export const updateUser = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);