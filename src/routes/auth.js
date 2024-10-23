import { fetchUser, loginCostumer, loginDeliveryPartner, refreshingToken } from "../controllers/auth/auth.js"
import { verifyToken } from "../middleware/auth.js"
import {updateDetails} from "../controllers/tracking/user.js"
export const authRoutes = async (fastify,options)=>{
    fastify.post('/customer/login',loginCostumer)
    fastify.post('/deliveryPartner/login',loginDeliveryPartner)
    fastify.post('/refresh-token',refreshingToken)
    fastify.get('/user',{preHandler:[verifyToken]},fetchUser)
    fastify.patch('/user',{preHandler:[verifyToken]},updateDetails)
}