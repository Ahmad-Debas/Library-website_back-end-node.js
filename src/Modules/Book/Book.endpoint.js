import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    create:[roles.Admin],
    allBooks:[roles.Admin],
    return:[roles.Admin],
    delete:[roles.Admin],
    update:[roles.Admin],
}
