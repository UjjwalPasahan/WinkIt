import { Order } from "../../models/order.js"
import { Branch } from "../../models/branch.js"
import { Customer, DeliveryPartner } from "../../models/user.js"

export const createOrder = async (req,res) => {
    try {
        const {userId} = req.user
        const {items , branch , totalPrice} = req.body

        const customerData= await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if(!customerData){
            return res.status(404).send({msg:"No user found"})
        }
        const newOrder = await Order.create({
            customer:userId,
            items:items.map(i=>({
                id:i.id,
                item:i.item,
                count:i.count
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude:customerData.liveLocation.latitude,
                longitude:customerData.liveLocation.longitude,
                address:customerData.address || "No Address Found"
            },
            pickUpLocation:{
                latitude:branchData.location.latitude,
                longitude:branchData.location.longitude,
                address:branchData.address || "No Address Found"
            },

        })

        return res.status(201).send({
            msg:'Order Successful',
            newOrder,
        })
    } catch (error) {
        return res.status(501).send({msg:"error creating order"})
    }
}


export const confirmOrder = async (req,res) => {
    try {
        const {orderId} = req.params
        const {userId} = req.user
        const {deliveryPersonLocation} = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)
        if(!deliveryPerson){
            return res.status(404).send({msg:"no delivery person found"})
        }

        const order = await Order.findById(orderId)

        if(!order){
            return res.status(404).send({msg:"no order found"})
        }

        if(order.status !== "available"){
            return res.send({message:"Order not available"})
        }

        order.status = "confirmed"

        order.deliveryPartner = userId
        order.deliveryPersonLocation={
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.longitude,
            address:deliveryPersonLocation.address
        }


        await order.save()

        req.server.io.to(orderId).emit("Order confirmed",order)

        return res.send(order)
    } catch (error) {
        return res.status(501).send({msg:"error confirming order"})
    }
}


export const updateOrderStatus = async (req,res) => {
    try {
        const {orderId} = req.params
        const{status,deliveryPersonLocation} = req.body

        const {userId} = req.user

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if(!deliveryPerson){
            return res.status(404).send({msg:"no delivery person found"})
        }

        req.server.io.to(orderId).emit("Live tracking updates",order)

        return res.send(order)
    } catch (error) {
        return res.status(501).send({msg:"error confirming order"})
    }
}


export const getOrders = async (req,res) => {
    try {
    const {status,deliveryPartnerId,customerId,branchId} = req.query
    let query = {}
    if(status){
        query.status=status
    }
    if(customerId){
        query.customer=customerId
    }
    if(deliveryPartnerId){
        query.deliveryPartner=deliveryPartnerId
        query.branch=branchId
    }

    const orders = await Order.find(query).populate("customer branch items.item deliveryPartner")
    if(!orders){
        return res.send({message:"No orders found"})
    }

    return res.send(orders) 
    }catch (error) {
        return res.send({message:"Something went wrong while finding the orders"})
    }
}


export const getOrderById = async (req,res) => {
    try {
        const {orderId} = req.params

        const order =(await Order.findById(orderId)).populated('customer branch items.item deliveryPartner')

        if(!order){
            return res.send({message:"No order found Invalid Id"})
        }

        return res.send(order) 
    } catch (error) {
        return res.send({message:"Something went wrong while finding the order by id"})
    }
}