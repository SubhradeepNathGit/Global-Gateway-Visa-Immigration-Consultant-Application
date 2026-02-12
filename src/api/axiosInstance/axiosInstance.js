import axios from "axios";
import baseUrl_country from "../api_url/apiUrl";

const axiosInstance_country = axios.create({
    baseURL: baseUrl_country,
    headers: {
        "Content-Type": "application/json",
    },
})

export default axiosInstance_country;