import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    add:[roles.User],
    show:[roles.User],
    remove:[roles.User],
    updateQuantity:[roles.User]
}
