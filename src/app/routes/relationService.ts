import { Prisma, prisma } from "@prisma/client";
import { waitForDebugger } from "inspector";
import { PrismaService } from "src/database/prisma.service";
import { getRoutes } from "../dtos/routes/getRoutes.dto";
export async function getRoutesRelation(prismaService : PrismaService){
    
    

    const routesData = prismaService.routes.findMany()
    const employees =  prismaService.employee.findMany({select:{id:true,name:true}})
    const cars =  prismaService.car.findMany({select:{id:true,plate:true}})
    const drivers =  prismaService.driver.findMany({select:{id:true,name:true}})
    const promise = await Promise.all([routesData,employees,cars,drivers])
    // let res: RoutesData = {
    //     routes: routesData,
    //     employ: employees,
    //     car: cars,
    //     driver: drivers
    // }

    let res :getRoutes = {
        routes: promise[0],
        employ: promise[1],
        car: promise[2],
        driver: promise[3]
    }
    return res;
}