import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PathService } from '../../services/path.service';
import { ERoutePathStatus, EStatusPath } from '../../utils/ETypes';
import { getDifferenceInHours } from '../../utils/date.service';

@Injectable()
export class FinishRouteJob {
  constructor(private readonly pathService: PathService) {}

  private readonly logger = new Logger(FinishRouteJob.name);

  @Cron(process.env.TIME_TO_UPDATE_JOB_FINISH_ROUTES)
  async execute() {
    this.logger.debug('Iniciando finalização de rotas em andamento...');

    let paths = await this.pathService.listAllByStatus(
      ERoutePathStatus.IN_PROGRESS,
    );

    const pendingPaths = await this.pathService.listAllByStatus(
      ERoutePathStatus.PENDING,
    );

    paths = paths.concat(pendingPaths);

    if (paths.length == 0) {
      return this.logger.debug(
        'Não há rotas pendentes ou em andamento para finalizar.',
      );
    }

    let diffInHours: number;

    for await (const path of paths) {
      const { startedAt, scheduledDate } = path;

      if (path.status === EStatusPath.IN_PROGRESS) {
        diffInHours = getDifferenceInHours(startedAt);

        if (
          diffInHours >= Number(process.env.TIME_LIMIT_TO_FINISH_ROUTE_IN_HR)
        ) {
          this.logger.debug(`Finalizando a rota ${path.id}...`);

          await this.pathService.finishPathByCron(path.id);

          this.logger.debug('Rota finalizada com sucesso!');
          this.logger.debug(`Estava pendente a ${diffInHours}h...`);

          return;
        }
      }

      if (path.status === EStatusPath.PENDING && scheduledDate) {
        diffInHours = getDifferenceInHours(scheduledDate);

        if (
          diffInHours >= Number(process.env.TIME_LIMIT_TO_FINISH_ROUTE_IN_HR)
        ) {
          this.logger.debug(`Finalizando a rota ${path.id}...`);

          await this.pathService.finishPathByCron(path.id);

          this.logger.debug('Rota finalizada com sucesso!');
          this.logger.debug(`Estava pendente a ${diffInHours}h...`);

          return;
        }
      }
    }
  }
}
