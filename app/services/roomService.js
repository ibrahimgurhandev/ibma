const RoomSchema = require("../models/RoomSchema")

class RoomServices{

    async addMessage(name, msgObject){
        console.log("Hitting Add Message", name, " ", msgObject)
        let doc = await RoomSchema.findOne({name: "Spanish"})
        console.log("DOC: ", doc)
        let message = msgObject;
        await doc.update({$push: {
            message:  message
        }})
    }

    async getByEmail(email){
        let doc = await UserSchema.findOne({email})
        return doc
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

module.exports = new RoomServices();