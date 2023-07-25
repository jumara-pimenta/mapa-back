import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RouteService } from '../../services/route.service';
import IScheduledWorkRepository from '../../repositories/scheduledWork/scheduledWork.repository.contract';
import { EEntity, EStatusWork } from '../../utils/ETypes';

@Injectable()
export class UpdateStatusRouteJob {
  constructor(
    private readonly routeService: RouteService,
    @Inject('IScheduledWorkRepository')
    private readonly scheduledWorkRepository: IScheduledWorkRepository,
  ) {}

  private readonly logger = new Logger(UpdateStatusRouteJob.name);

  @Cron(process.env.JOB_UPDATE_TIME)
  async execute() {
    this.logger.debug('Iniciando atualização do status das rotas...');

    let totalWorksCompleted = 0;

    const pendingWorks =
      await this.scheduledWorkRepository.findManyByEntityAndStatusToday(
        EEntity.ROUTE,
        EStatusWork.PENDING,
      );

    if (pendingWorks.length > 0) {
      this.logger.debug(
        `${pendingWorks.length} para ser(em) atualizada(as)...`,
      );

      for await (const work of pendingWorks) {
        const route = await this.routeService.resetStatusRoute(work.idEntity);

        this.logger.debug(`A rota ${route.description} foi atualizada...`);

        totalWorksCompleted++;
        
        await this.scheduledWorkRepository.update({
          ...work,
          status: EStatusWork.COMPLETED,
        });
      }

      this.logger.debug(`${totalWorksCompleted} rotas foram atualizadas!`);
      totalWorksCompleted = 0;
    }

    this.logger.debug('Nenhuma rota para ser atualizada!.');
  }
}
