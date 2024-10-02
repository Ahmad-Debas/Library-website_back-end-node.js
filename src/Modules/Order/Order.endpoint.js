import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    create:[roles.User],
    getOrders:[roles.User],
    cancel:[roles.User],
    changeStatus:[roles.Admin],
    allOrders:[roles.Admin],
    getOrder:[roles.Admin,roles.User],
    getPendingOrder:[roles.User],
    userOrders:[roles.Admin],
    addDuration:[roles.Admin],
    admin:[roles.Admin]
}
