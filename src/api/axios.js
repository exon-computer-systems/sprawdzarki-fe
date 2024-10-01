import axios from "axios";
const SLIDER_URL = "http://192.168.68.247:1338";
const PRODUCT_URL = "http://swpl0003001.store.obi.net:8080";

export const axiosSlider = axios.create({
    baseURL: SLIDER_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosProduct = axios.create({
    baseURL: PRODUCT_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
