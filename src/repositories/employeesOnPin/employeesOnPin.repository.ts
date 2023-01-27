import { Injectable } from '@nestjs/common';
import { Page, PageResponse } from '../../configs/database/page.model';
import { Pageable } from '../../configs/database/pageable.service';
import { PrismaService } from '../../configs/database/prisma.service';
import { EmployeesOnPin } from '../../entities/employeesOnPin.entity';
import IEmployeesOnPinRepository from './employeesOnPin.repository.contract';

@Injectable()
export class EmployeesOnPinRepository
  extends Pageable<EmployeesOnPin>
  implements IEmployeesOnPinRepository
{
  constructor(private readonly repository: PrismaService) {
    super();
  }
  find(employeeId: string, pinId: string): Promise<EmployeesOnPin> {
    return this.repository.employeesOnPin.findUnique({
      where: {
        employeeId_pinId: {
          employeeId: employeeId,
          pinId: pinId,
        },
      },
    });
  }

  create(data: EmployeesOnPin): Promise<EmployeesOnPin> {
    return this.repository.employeesOnPin.upsert({
      where: {
        employeeId_pinId: {
          employeeId: data.employee.id,
          pinId: data.pin.id,
        },
      },
      create: {
        employeeId: data.employee.id,
        pinId: data.pin.id,
        type: data.type,
      },
      update: {
        employeeId: data.employee.id,
        pinId: data.pin.id,
        type: data.type,
      },
    });
  }

  update(pinId: string, data: EmployeesOnPin): Promise<EmployeesOnPin> {
    return this.repository.employeesOnPin.update({
      where: {
        employeeId_pinId: {
          employeeId: data.employee.id,
          pinId: pinId,
        },
      },
      data: {
        employeeId: data.employee.id,
        pinId: data.pin.id,
        type: data.type,
      },
    });
  }

  async delete(employeeId: string, pinId: string) {
    await this.repository.employeesOnPin.delete({
      where: {
        employeeId_pinId: {
          employeeId: employeeId,
          pinId: pinId,
        },
      },
    });
    return;
  }
}
