import { GetCarPayload } from "../car/getCarPayload.dto"
import { GetDriverPayload } from "../driver/getDriverPayload.dto"
import { GetEmployeePayload } from "../employee/getEmployeePayload.dto"
import { Routes } from "./routes.dto"


export type getRoutes = {
    routes : Routes[]
    employ : GetEmployeePayload[]
    car   : GetCarPayload[]
    driver : GetDriverPayload[]
}