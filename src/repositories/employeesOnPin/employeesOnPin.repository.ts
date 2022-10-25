import { Injectable } from "@nestjs/common";
import { Page, PageResponse } from "../../configs/database/page.model";
import { Pageable } from "../../configs/database/pageable.service";
import { PrismaService } from "../../configs/database/prisma.service";
import { EmployeesOnPin } from "../../entities/employeesOnPin.entity";
import IEmployeesOnPinRepository from "./employeesOnPin.repository.contract";

@Injectable()
export class EmployeesOnPinRepository extends Pageable<EmployeesOnPin> implements IEmployeesOnPinRepository {
  constructor(
    private readonly repository: PrismaService
  ) {
    super()
  }

  create(data: EmployeesOnPin): Promise<EmployeesOnPin> {
    return this.repository.employeesOnPin.create({
      data: {
        employeeId: data.employee.id,
        pinId: data.pin.id,
        type: data.type
      }
    });
  }
}