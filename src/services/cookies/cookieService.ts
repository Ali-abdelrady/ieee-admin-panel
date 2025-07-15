import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

class cookieService {
    // get
    get(name: string) {
        return cookies.get(name);
    }
    // set
    set(name: string, value: any, options?: CookieSetOptions) {
        return cookies.set(name, value, options);
    }
    // remove
    remove(name: string) {
        return cookies.remove(name);
    }
}
export default new cookieService();
