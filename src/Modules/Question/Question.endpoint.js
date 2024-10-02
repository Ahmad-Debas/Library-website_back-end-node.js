import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    create:[roles.Admin],
    delete:[roles.Admin],
    update:[roles.Admin],
}
