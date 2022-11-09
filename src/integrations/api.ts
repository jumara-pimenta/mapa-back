import axios from "axios";

export const coreApi = () => axios.create({
    baseURL: process.env.CORE_API_URL
})
