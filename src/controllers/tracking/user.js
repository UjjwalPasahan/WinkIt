import { Customer, DeliveryPartner } from "../../models/user.js"

const updateDetails = async (req,res) => {
    try {
        const {userId} = req.user
        const updatedData = req.body

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

        if(!user){
            return res.status(401).send({msg:"no user found"})
        }

        let UserModel;

        if(user.role === 'Customer'){
            UserModel = Customer;
        }
        else if(user.role === 'DeliveryPartner'){
            UserModel = DeliveryPartner;
        }else{
            return res.status(401).send({msg:"Invalid role"})
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId,{$set:updatedData},{new :true,runValidators:true})

        if(!updatedUser){
            return res.status(501).send({msg:"updation failed"})
        }

        return res.status(201).send({
            msg:'Updation Successful',
            user:updatedUser
        })
    } catch (error) {
        return res.status(401).send({msg:"Failed to update user "})
    }
}


export {updateDetails}