import { roles } from "../../Middleware/Auth.middleware.js";


export const endPoint = {
    create:[roles.Admin],
    updateAds:[roles.Admin],
    deleteAd:[roles.Admin],
    allAds:[roles.Admin],
}
