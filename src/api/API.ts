import axios from "axios";

const API_URL: string = `http://localhost:5000/api`;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    return config;
})

export default $api;