import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    create:[roles.Admin],
    update:[roles.Admin]

}
