import { BadGatewayException } from "@nestjs/common";
import { Prisma, prisma } from "@prisma/client";
import { create } from "domain";
import { waitForDebugger } from "inspector";
import { PrismaCodeError, PrismaMessageError } from "src/constants/exceptions";
import { PrismaService } from "src/database/prisma.service";
import { createRoutes } from "../dtos/routes/createRoutes.dto";
import { getRoutes } from "../dtos/routes/getRoutes.dto";

export async function getRoutesRelation(prismaService : PrismaService){
    
    const routesData = prismaService.routes.findMany()
    const employees =  prismaService.employee.findMany({select:{id:true,name:true}})
    const cars =  prismaService.car.findMany({select:{id:true,plate:true}})
    const drivers =  prismaService.driver.findMany({select:{id:true,name:true}})

    try {
        const promise = await Promise.all([routesData,employees,cars,drivers])
        let res :getRoutes = {
            routes: promise[0],
            employ: promise[1],
            car: promise[2],
            driver: promise[3]
        }
        return res;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PrismaCodeError.UNIQUE_CONSTRAINT
        ) {
          throw new BadGatewayException(
            PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
          );
        }
        throw error;
      }
}

export async function createRoutesRelation(prismaService : PrismaService,createRoute : createRoutes) {

    createRoute.employeeIds.map( item => {
    console.log(item)
    })

    try {

        const route = await prismaService.routes.create({
          data:{
              name: createRoute.routes.name,
              totalDist: createRoute.routes.totalDist,
              typeOfRoutes: createRoute.routes.typeOfRoutes,
              startTime: createRoute.routes.startTime,
              duration: createRoute.routes.duration,
              driverId : createRoute.driverId,
              carId : createRoute.carId,
             
              employees : {
                connect: createRoute.employeeIds.map(item =>{
                  return {id :item}
                })
              }
              

        }})
        return route;
      } catch (error) {
        console.log(error)

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PrismaCodeError.UNIQUE_CONSTRAINT
        ) {
          throw new BadGatewayException(
            PrismaMessageError.UNIQUE_CONSTRAINT_VIOLATION,
          );
        }
        throw error;
      }
}