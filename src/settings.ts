// import assert from 'assert';

// export function getEnvOrThrow(envName: string): string {
//   const env = process.env[envName];
//   console.log(env);
  
//   assert(env, `Missing environment variable ${envName}`);
//   return env;
// }

// export function getEnvOrDefault(envName: string, defaultValue: string ): string {
//   return process.env[envName] ?? defaultValue;
// }

// // Aplicação
// export const PORT_BACKEND = getEnvOrThrow('PORT_BACKEND');
// export const DENSO_ID = getEnvOrThrow('DENSO_ID');

// // Banco de dados
// export const DATABASE_URL = getEnvOrThrow('DATABASE_URL');

// // Chave secreta para tokens de acesso
// export const SECRET_KEY_ACCESS_TOKEN = getEnvOrThrow('SECRET_KEY_ACCESS_TOKEN');

// // Ambiente
// export const ENVIRONMENT = getEnvOrDefault('ENVIRONMENT', 'development');

// // Chave de API do Mapbox
// export const MAP_BOX_API_KEY = getEnvOrThrow('MAP_BOX_API_KEY');

// // Chave de API do Google Maps
// export const GOOGLE_MAPS_API_KEY = getEnvOrThrow('GOOGLE_MAPS_API_KEY');

// // Tempo para atualizar o status da rota
// export const TIME_TO_UPDATE_JOB_UPDATE_STATUS = getEnvOrThrow(
//   'TIME_TO_UPDATE_JOB_UPDATE_STATUS',
// );

// // Tempo para finalizar rotas não finalizadas pelo motorista
// export const TIME_TO_UPDATE_JOB_FINISH_ROUTES = getEnvOrThrow(
//   'TIME_TO_UPDATE_JOB_FINISH_ROUTES',
// );

// // Tempo de duração em horas para que a rota seja atualizada depois de iniciada
// export const TIME_LIMIT_TO_FINISH_ROUTE_IN_HR = getEnvOrThrow(
//   'TIME_LIMIT_TO_FINISH_ROUTE_IN_HR',
// );

// // Features
// export const FEATURE_ENABLED_LIST_ONLY_DAY_PATHS =
//   getEnvOrDefault('FEATURE_ENABLED_LIST_ONLY_DAY_PATHS', 'false') === 'true';
