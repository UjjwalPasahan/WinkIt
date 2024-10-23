import { Category } from "../../models/category.js"

export const getAllCategories = async(req,res)=>{
    try {
        const categories = await Category.find()
    
        return res.status(201).send({
            msg:'Login Successful',
            categories
        })
    } catch (error) {
        return res.status(501).send({msg:"something went wrong"})
    }
}
