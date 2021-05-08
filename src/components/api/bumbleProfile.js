import { BottomNavigation } from "@material-ui/core";
import { apiConfig } from "./config"

export const startAnalysis = (subKey, sharedKey, email, password, nbSwipe) => {
    let headers = new Headers();
    headers.append('Authorization', `Basic ${btoa(email + ":" + password)}`)
    return fetch(`${apiConfig.URL}/bot/swapper/bumble?numberOfSwipe=${nbSwipe}&subKey=${subKey}&sharedKey=${sharedKey}`, {
        method: "GET",
        headers
    });
}