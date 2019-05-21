var baseURL = "http://221.176.34.113:8080/demo/meetquiz"

if (process.env.NODE_ENV == "development") {
    baseURL = "http://221.176.34.113:8080/demo/meetquiz";
    // baseURL = "http://192.168.203.160/meetquiz";
}

export default baseURL;