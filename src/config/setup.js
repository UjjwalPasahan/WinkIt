import AdminJS from "adminjs";
import * as AdminJsMongoose from "@adminjs/mongoose"
import * as Model from "../models/index.js";
import AdminJSFastify from "@adminjs/fastify";
import { authenticate, Cookie_Password, sessionStore } from "./config.js";
import {dark,light,noSidebar} from "@adminjs/themes"

AdminJS.registerAdapter(AdminJsMongoose)

export const admin = new AdminJS({
    resources:[
        {
            resource: Model.Customer,
            options:{
                listProperties:["phone","role","isActive"],
                filterProperties:["phone","role"]
            }
        },
        {
            resource: Model.DeliveryPartner,
            options:{
                listProperties:["email","role","isActive"],
                filterProperties:["email","role"]
            }
        },
        {
            resource: Model.Admin,
            options:{
                listProperties:["phone","role","isActive"],
                filterProperties:["phone","role"]
            }
        },
        {
            resource: Model.Branch,
        },
        {
            resource: Model.Product,
        },
        {
            resource: Model.Category,
        },
        {
            resource: Model.Order,
        },
        {
            resource: Model.Counter,
        }
    ],
    branding:{
        companyName:"BlinkIt",
        withMadeWithLove:false,
        // favicon:pngs
    },
    defaultTheme:dark.id,
    availableThemes:[dark,light,noSidebar],
    rootPath:"/admin"
})

export const buildAminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword:Cookie_Password,
            cookieName:"adminjs",
        },
        app,
        {
            store:sessionStore,
            saveUninitialized:true,
            secret:Cookie_Password,
            cookie:{
                httpOnly:process.env.NODE_ENV === "production",
                secure:process.env.NODE_ENV === "production"
            }
        }
    )
}