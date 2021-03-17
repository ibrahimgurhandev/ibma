const UserSchema = require("../models/UserSchema")

class UserServices{

    async create(){
        console.log("Creating User~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    }

    async getByEmail(email){
        let doc = await UserSchema.findOne({email}, this.success)
        return doc
    }

    async getBySocketId(socketId){
        let doc = await UserSchema.findOne({socketId}, this.success)
        return doc
    }

    async getByRoom(room){
        let docs = await UserSchema.find({room}, this.success)
        console.log("GETTING ROOMS",docs)
        return docs
    }

    async getById(_id){
        let doc = await UserSchema.findOne({_id}, this.success)
        return doc;
    }

    async update(user){
        let doc = await UserSchema.findOneAndUpdate({_id:user.id}, user)
        return doc;
    }
    async updateRoom(name, room){
        let doc = await UserSchema.findOneAndUpdate({name}, {room})
        return doc;
    }

    async updateRoomAndSocket(name, room, socketId){
        let doc = await UserSchema.findOne({name: name})
        let copy = doc;
        await doc.update({room: room, socketId: socketId}, this.success)
        return copy;
    }

    async clearRoomAndSocket(socketId){
        let doc = await UserSchema.findOne({socketId})
        let copy = doc;
        await doc.update({room: "", socketId: ""}, this.success)
        return copy;
    }

    async delete(){
        console.log("Deleting User")
    }

    success(err, raw){
        if(err)console.log("ERROR: ", err)
        else console.log("RAW: ", raw)
    }
}

module.exports = new UserServices();