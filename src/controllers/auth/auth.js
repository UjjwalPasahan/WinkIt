import { Customer,DeliveryPartner } from "../../models/user.js";
import jwt from 'jsonwebtoken'

const generateTokens = (user) => {
    try {
        const accessToken = jwt.sign(
            {userId:user._id,role:user.role},
            process.env.ACCESS_TOKEN_SECERT,
            {expiresIn : "1d"}
        );

        const refreshToken = jwt.sign(
            {userId:user._id,role:user.role},
            process.env.REFRESH_TOKEN_SECERT,
            {expiresIn : "10d"}
        );

        return {accessToken,refreshToken};

    } catch (error) {
        console.log(error)
    }
}


const loginCostumer = async (req,res) => {
    try {
        const {phone} = req.body;

        let customer = await Customer.findOne({phone})

        if(!customer){
            customer = new Customer({
                phone,
                isActive:true,
                role:'Customer'
            })

            await customer.save();
        }

        const {accessToken,refreshToken} = generateTokens(customer)

        return res.status(201).send({
            msg:customer?'Login Successful' : 'Account created Successfully',
            accessToken,
            refreshToken,
            customer
        })
    } catch (error) {
        return res.status(500).send({msg:'An Error occured'})
    }
}

const loginDeliveryPartner = async (req,res) => {
    try {
        const {email,password} = req.body;

        let deliveryPartner = await DeliveryPartner.findOne({email,password})

        if(!deliveryPartner){
            return res.status(404).send({msg:"Delivery Parter not found"})
        }

        const isMatched = password === deliveryPartner.password;

        if (!isMatched) {
            return res.status(400).send({msg:"wrong credentials"})
        }
        const {accessToken,refreshToken} = generateTokens(deliveryPartner)

        return res.status(201).send({
            msg:'Login Successful',
            accessToken,
            refreshToken,
            deliveryPartner
        })
    } catch (error) {
        return res.status(500).send({msg:'An Error occured'})
    }
}

const refreshingToken = async (req,res) => {
    const {refreshToken } = req.body;
    
    if(!refreshToken){
        return res.status(401).send({msg:"refresh token required"})
    }

    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        let user;

        if(decoded.role==='Customer'){
            user = await Customer.findById(decoded.userId)
        }else if (decoded.role==='DeliveryPartner') {
            user = await DeliveryPartner.findById(decoded.userId)
        }else{
            return res.status(401).send({msg:"Invalid refresh token"})
        }

        if(!user){
            return res.status(401).send({msg:"Invalid refresh token"})
        }

        const {accessToken,refreshToken:newRefreshToken} = generateTokens(user)

        return res.status(201).send({
            msg:'token refreshed',
            accessToken,
            refreshToken:newRefreshToken,
        })
    } catch (error) {
        return res.status(401).send({msg:"Invalid refresh token"})
    }
}


const fetchUser = async (req,res) => {
    try {
        const {userId,role} = req.user;

        let user;

        if(role==='Customer'){
            user = await Customer.findById(userId)
        }else if (role==='DeliveryPartner') {
            user = await DeliveryPartner.findById(userId)
        }else{
            return res.status(401).send({msg:"Invalid refresh token"})
        }

        if(!user){
            return res.status(401).send({msg:"Invalid refresh token"})
        }

        return res.status(201).send({
            msg:'info fetched successfully',
            user
        })
    } catch (error) {
        return res.status(500).send({msg:"An error occured"})

    }
}


export {fetchUser,loginCostumer,loginDeliveryPartner,refreshingToken}