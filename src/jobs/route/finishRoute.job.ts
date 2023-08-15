import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PathService } from '../../services/path.service';
import { ERoutePathStatus } from '../../utils/ETypes';
import { getDifferenceInHours } from '../../utils/date.service';

@Injectable()
export class FinishRouteJob {
  constructor(private readonly pathService: PathService) {}

  private readonly logger = new Logger(FinishRouteJob.name);

  @Cron(process.env.TIME_TO_UPDATE_JOB_FINISH_ROUTES)
  async execute() {
    this.logger.debug('Iniciando finalização de rotas pendentes...');

    const paths = await this.pathService.listAllByStatus(
      ERoutePathStatus.IN_PROGRESS,
    );

    if (paths.length == 0) {
      return this.logger.debug('Não há rotas pendentes para finalizar.');
    }

    for await (const path of paths) {
      const { startedAt } = path;

      if (startedAt) {
        const diffInHours = getDifferenceInHours(startedAt);

        if (
          diffInHours >= Number(process.env.TIME_LIMIT_TO_FINISH_ROUTE_IN_HR)
        ) {
          this.logger.debug(`Finalizando a rota ${path.id}...`);

          await this.pathService.finishPath(path.id);

          this.logger.debug('Rota finalizada com sucesso!');
          this.logger.debug(`Estava pendente a ${diffInHours}h...`);
        }
      }
    }
  }
}
