const UserSchema = require("../models/UserSchema")

class UserServices{

    async create(){
        console.log("Creating User~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    }

    async getByEmail(email){
        let doc = await UserSchema.findOne({email})
        return doc
    }

    async getByRoom(room){
        let docs = await UserSchema.find({room: room})
        return docs
    }

    async getById(id){
        let doc = await UserSchema.findOne({_id: id})
        return doc;
    }

    async update(user){
        let doc = await UserSchema.findOneAndUpdate({_id:user.id}, user)
        return doc;
    }

    async delete(){
        console.log("Deleting User")
    }
}

module.exports = new UserServices();