# SONAR ROTAS BACK

![ROTAS](/uploads/e44c21637ef17a54a11b36ace6f005fb/ROTAS.png)

Este repositório contém as informações necessárias para facilitar deploy e instalação, do back-end do sistema SONAR - ROTAS no seu ambiente de desenvolvimento ou de produção.

# Tabela de conteúdos

<!--ts-->

- [Status do Projeto](#1-status-do-projeto)
- [Estrutura de pastas](#2-estrutura-de-pastas)
- [Pré-requisitos](#3-pré-requisitos)
- [Clonando o repositório de back-end do projeto SONAR ROTAS](#4-clonando-o-repositório-de-back-end-do-projeto-sonar-rotas)
- [Configurações](#5-configurações)
- [Configuração de deploy back-end do projeto SONAR ROTAS usando o Docker](#6-configuração-de-deploy-back-end-do-projeto-sonar-rotas-usando-o-docker)
- [Comandos básicos para utilização do SONAR ROTAS back-end no Docker](#comandos-básicos-para-utilização-do-sonar-rotas-back-end-no-docker)
- [Configuração de deploy back-end do projeto SONAR ROTAS usando o Node.js](#7-configuração-de-deploy-back-end-do-projeto-sonar-rotas-usando-o-nodejs)
- [Comandos básicos para utilização do SONAR ROTAS back-end no Node.Js](#comandos-básicos-para-utilização-do-sonar-rotas-back-end-no-nodejs)
- [Testes E2E: Como executar](#testes-e2e-como-executar)
<!--te-->

## 1. Status do Projeto

Em andamento

## 2. Estrutura de pastas

```bash
📦 SONAR-ROTAS-BACK
📦prisma
 ┣ 📂migrations
 ┃ ┣ 📂20230127144500_1
 ┃ ┃ ┗ 📜migration.sql
 ┃ ┗ 📜migration_lock.toml
 ┗ 📜schema.prisma
 📦src
 ┣ 📂configs
 ┃ ┣ 📂authentication
 ┃ ┃ ┗ 📜auth.guard.ts
 ┃ ┗ 📂database
 ┃ ┃ ┣ 📜Queries.ts
 ┃ ┃ ┣ 📜page.model.ts
 ┃ ┃ ┣ 📜pageable.service.ts
 ┃ ┃ ┗ 📜prisma.service.ts
 ┣ 📂controllers
 ┃ ┣ 📜api.controller.ts
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜driver.controller.ts
 ┃ ┣ 📜employee.controller.ts
 ┃ ┣ 📜employeesOnPath.controller.ts
 ┃ ┣ 📜employeesOnPin.controller.ts
 ┃ ┣ 📜path.controller.ts
 ┃ ┣ 📜pin.controller.ts
 ┃ ┣ 📜route.controller.ts
 ┃ ┣ 📜routeHistory.controller.ts
 ┃ ┗ 📜vehicle.controller.ts
 ┣ 📂database
 ┃ ┣ 📂queries
 ┃ ┃ ┗ 📜Queries.ts
 ┃ ┣ 📜prisma.module.ts
 ┃ ┗ 📜prisma.service.ts
 ┣ 📂decorators
 ┃ ┣ 📜private.decorator.ts
 ┃ ┣ 📜public.decorator.ts
 ┃ ┗ 📜roles.decorator.ts
 ┣ 📂dtos
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜CoreToken.dto.ts
 ┃ ┃ ┣ 📜backOfficeUserLogin.dto.ts
 ┃ ┃ ┣ 📜filterBackOfficeUser.dto.ts
 ┃ ┃ ┣ 📜header.dto.ts
 ┃ ┃ ┣ 📜mappedBackOfficeUser.dto.ts
 ┃ ┃ ┣ 📜queryBackOfficeUser.dto.ts
 ┃ ┃ ┗ 📜token.dto.ts
 ┃ ┣ 📂driver
 ┃ ┃ ┣ 📜createDriver.dto.ts
 ┃ ┃ ┣ 📜filtersDriver.dto.ts
 ┃ ┃ ┣ 📜mappedDriver.dto.ts
 ┃ ┃ ┣ 📜queryDriver.dto.ts
 ┃ ┃ ┣ 📜signInDriver.dto.ts
 ┃ ┃ ┗ 📜updateDriver.dto.ts
 ┃ ┣ 📂employee
 ┃ ┃ ┣ 📜createEmployee.dto.ts
 ┃ ┃ ┣ 📜createEmployeeFile.dto.ts
 ┃ ┃ ┣ 📜employeeAddress.dto.ts
 ┃ ┃ ┣ 📜filtersEmployee.dto.ts
 ┃ ┃ ┣ 📜mappedEmployee.dto.ts
 ┃ ┃ ┣ 📜queryEmployee.dto.ts
 ┃ ┃ ┣ 📜signInEmployee.dto.ts
 ┃ ┃ ┗ 📜updateEmployee.dto.ts
 ┃ ┣ 📂employeesOnPath
 ┃ ┃ ┣ 📜createEmployeesOnPath.dto.ts
 ┃ ┃ ┣ 📜filtersEmployeesOnPath.dto.ts
 ┃ ┃ ┣ 📜idUpdateWebsocket.ts
 ┃ ┃ ┣ 📜mappedEmployeesOnPath.dto.ts
 ┃ ┃ ┣ 📜queryEmployeesOnPath.dto.ts
 ┃ ┃ ┣ 📜updateEmployeesOnPath.dto.ts
 ┃ ┃ ┣ 📜updateEmployeesStatusOnPath.dto.ts
 ┃ ┃ ┗ 📜websocketUpdateEmployeesOnPath.dto.ts
 ┃ ┣ 📂employeesOnPin
 ┃ ┃ ┗ 📜associateEmployeeOnPin.dto.ts
 ┃ ┣ 📂path
 ┃ ┃ ┣ 📜createPath.dto.ts
 ┃ ┃ ┣ 📜filtersPath.dto.ts
 ┃ ┃ ┣ 📜mappedPath.dto.ts
 ┃ ┃ ┣ 📜pathDetails.dto.ts
 ┃ ┃ ┣ 📜queryPath.dto.ts
 ┃ ┃ ┗ 📜updatePath.dto.ts
 ┃ ┣ 📂pin
 ┃ ┃ ┣ 📜createEmployeePin.dto.ts
 ┃ ┃ ┣ 📜createPin.dto.ts
 ┃ ┃ ┣ 📜filtersPin.dto.ts
 ┃ ┃ ┣ 📜mappedPin.dto.ts
 ┃ ┃ ┣ 📜queryPin.dto.ts
 ┃ ┃ ┣ 📜updateEmployeePin.dto.ts
 ┃ ┃ ┗ 📜updatePin.dto.ts
 ┃ ┣ 📂route
 ┃ ┃ ┣ 📜createRoute.dto.ts
 ┃ ┃ ┣ 📜filtersRoute.dto.ts
 ┃ ┃ ┣ 📜mappedRoute.dto.ts
 ┃ ┃ ┣ 📜queryRoute.dto.ts
 ┃ ┃ ┗ 📜updateRoute.dto.ts
 ┃ ┣ 📂routeHistory
 ┃ ┃ ┣ 📜createRouteHistory.dto.ts
 ┃ ┃ ┣ 📜dateFilter.dto.ts
 ┃ ┃ ┣ 📜filtersRouteHistory.dto.ts
 ┃ ┃ ┣ 📜mappedRouteHistory.dto.ts
 ┃ ┃ ┣ 📜queryRouteHistory.dto.ts
 ┃ ┃ ┣ 📜routeHistoryByDate.dto.ts
 ┃ ┃ ┗ 📜updateRouteHistory.dto.ts
 ┃ ┣ 📂validation
 ┃ ┃ ┗ 📜validation.dto.ts
 ┃ ┣ 📂vehicle
 ┃ ┃ ┣ 📜createVehicle.dto.ts
 ┃ ┃ ┣ 📜filtersVehicle.dto.ts
 ┃ ┃ ┣ 📜mappedVehicle.dto.ts
 ┃ ┃ ┣ 📜queryVehicle.dto.ts
 ┃ ┃ ┗ 📜updateVehicle.dto.ts
 ┃ ┗ 📂websocket
 ┃ ┃ ┣ 📜StatusRoute.dto.ts
 ┃ ┃ ┣ 📜currentLocal.dto.ts
 ┃ ┃ ┗ 📜startRoute.dto.ts
 ┣ 📂entities
 ┃ ┣ 📜backOfficeUser.entity.ts
 ┃ ┣ 📜driver.entity.ts
 ┃ ┣ 📜employee.entity.ts
 ┃ ┣ 📜employeesOnPath.entity.ts
 ┃ ┣ 📜employeesOnPin.entity.ts
 ┃ ┣ 📜path.entity.ts
 ┃ ┣ 📜pin.entity.ts
 ┃ ┣ 📜route.entity.ts
 ┃ ┣ 📜routeHistory.entity.ts
 ┃ ┣ 📜routeWebsocket.entity.ts
 ┃ ┗ 📜vehicle.entity.ts
 ┣ 📂exceptions
 ┃ ┣ 📂handlers
 ┃ ┃ ┣ 📜integrationException.handler.ts
 ┃ ┃ ┗ 📜unknowErrorException.handler.ts
 ┃ ┗ 📜integrationException.ts
 ┣ 📂gateway
 ┃ ┗ 📜websocket.gateway.ts
 ┣ 📂integrations
 ┃ ┣ 📂services
 ┃ ┃ ┗ 📂coreService
 ┃ ┃ ┃ ┣ 📂request
 ┃ ┃ ┃ ┃ ┗ 📜logout.request.ts
 ┃ ┃ ┃ ┣ 📂response
 ┃ ┃ ┃ ┃ ┣ 📜getAllUsers.response.ts
 ┃ ┃ ┃ ┃ ┗ 📜verifyToken.response.ts
 ┃ ┃ ┃ ┣ 📜core.service.integration.contract.ts
 ┃ ┃ ┃ ┗ 📜core.service.integration.ts
 ┃ ┗ 📜api.ts
 ┣ 📂modules
 ┃ ┣ 📜api.module.ts
 ┃ ┣ 📜app.module.ts
 ┃ ┣ 📜auth.module.ts
 ┃ ┣ 📜driver.module.ts
 ┃ ┣ 📜employee.module.ts
 ┃ ┣ 📜employeesOnPath.module.ts
 ┃ ┣ 📜employeesOnPin.module.ts
 ┃ ┣ 📜path.module.ts
 ┃ ┣ 📜pin.module.ts
 ┃ ┣ 📜repository.module.ts
 ┃ ┣ 📜route.module.ts
 ┃ ┣ 📜routeHistory.module.ts
 ┃ ┣ 📜vehicle.module.ts
 ┃ ┗ 📜websocket.module.ts
 ┣ 📂repositories
 ┃ ┣ 📂backOfficeUser
 ┃ ┃ ┣ 📜backOffice.repository.contract.ts
 ┃ ┃ ┗ 📜backOffice.repository.ts
 ┃ ┣ 📂driver
 ┃ ┃ ┣ 📜driver.repository.contract.ts
 ┃ ┃ ┗ 📜driver.repository.ts
 ┃ ┣ 📂employee
 ┃ ┃ ┣ 📜employee.repository.contract.ts
 ┃ ┃ ┗ 📜employee.repository.ts
 ┃ ┣ 📂employeesOnPath
 ┃ ┃ ┣ 📜employeesOnPath.repository.contract.ts
 ┃ ┃ ┗ 📜employeesOnPath.repository.ts
 ┃ ┣ 📂employeesOnPin
 ┃ ┃ ┣ 📜employeesOnPin.repository.contract.ts
 ┃ ┃ ┗ 📜employeesOnPin.repository.ts
 ┃ ┣ 📂path
 ┃ ┃ ┣ 📜path.repository.contract.ts
 ┃ ┃ ┗ 📜path.repository.ts
 ┃ ┣ 📂pin
 ┃ ┃ ┣ 📜pin.repository.contract.ts
 ┃ ┃ ┗ 📜pin.repository.ts
 ┃ ┣ 📂route
 ┃ ┃ ┣ 📜route.repository.contract.ts
 ┃ ┃ ┗ 📜route.repository.ts
 ┃ ┣ 📂routeHistory
 ┃ ┃ ┣ 📜routeHistory.repository.contract.ts
 ┃ ┃ ┗ 📜routeHistory.repository.ts
 ┃ ┗ 📂vehicle
 ┃ ┃ ┣ 📜vehicle.repository.contract.ts
 ┃ ┃ ┗ 📜vehicle.repository.ts
 ┣ 📂services
 ┃ ┣ 📜auth.service.ts
 ┃ ┣ 📜backOfficeUser.service.ts
 ┃ ┣ 📜driver.service.ts
 ┃ ┣ 📜employee.service.ts
 ┃ ┣ 📜employeesOnPath.service.ts
 ┃ ┣ 📜employeesOnPin.service.ts
 ┃ ┣ 📜path.service.ts
 ┃ ┣ 📜pin.service.ts
 ┃ ┣ 📜route.service.ts
 ┃ ┣ 📜routeHistory.service.ts
 ┃ ┗ 📜vehicle.service.ts
 ┣ 📂utils
 ┃ ┣ 📜Date.ts
 ┃ ┣ 📜ETypes.ts
 ┃ ┣ 📜QueriesEmployee.ts
 ┃ ┣ 📜QueriesPins.ts
 ┃ ┣ 📜Regex.ts
 ┃ ┣ 📜Utils.ts
 ┃ ┣ 📜date.service.ts
 ┃ ┣ 📜examples.swagger.ts
 ┃ ┗ 📜roles.permissions.ts
 ┗ 📜main.ts
```

## 3. Pré-requisitos

- Sistema operacional Linux instalado - Ubuntu 20.04

  - https://ubuntu.com/download/desktop <br/><br/>

- Instalar VS CODE para visualizar os projetos

  - https://code.visualstudio.com/Download <br/><br/>

- Instalar Node versão 16.14.2 LTS (ou versão superior LTS)

  - https://nodejs.org/en/download/ <br/><br/>

    - Obs: Existe várias formas de instalação do node, uma delas é via package manager. Se optar por essa forma de instalação, é necessário da instalação do <b>CURL</b>.<br/><br/>
      \*Para instalar o <b>CURL</b> acesse o link abaixo

      ```sh
      https://curl.se/
      ```

      ou instale via linha de comando no terminal de Ubuntu

      ```sh
      sudo snap install curl  # version 7.76.1
      ```

      ou

      ```sh
      sudo apt  install curl  # version 7.68.0-1ubuntu2.7
      ```

  - Verificar se o Node.js e NPM estão instalados.<br/>
    Quando instalamos o Node.js o gerenciador de pacotes NPM também é instalado, para confirmar a instalação do Node.js e NPM abra o terminal de comando do Ubuntu e execute os comandos abaixo <br/><br/>
    `sh
node --version 
`
    ou

                        ```sh
                        npm --version
                        ```

                        se a instalação estiver correta a respostado terminal deve conter algo assim.

                        ```sh
                        $ node --version
                        v16.14.2

                            $ npm --version
                            8.1.2

                        ```

                        ```

                        ```

- Instalar Yarn versão 1.22.18 LTS (ou versão superior LTS)

  - https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

    ```sh
    $ sudo npm install --global yarn
    ```

- Instalar a versão Git 2.25.1 LTS (ou superior LTS)

  - https://git-scm.com/download/linux

    ou instale via linha de comando no terminal de Ubuntu

    ```sh
    $ sudo apt-get install git-all
    ```

- Instalar o Banco de Dados do MSSQL Server 2019 LTS (ou superior LTS)

  - https://www.microsoft.com/pt-br/sql-server/sql-server-downloadsbr><br><br/>

  <b>Obs: Existe um repositório no GitLab da DENSO com um projeto chamado MSSQL que contém uma imagem do MSSQL no Docker, que pode facilitar a instalação e criação do banco de dados, porém para usar esse projeto e necessário finalizar os passos abaixo.</b><br><br/>

<b>Para o deploy usando o Node.Js não é necessário instalar os pré-requisitos abaixo, siga para a etapa 7 deste manual, porém para o deploy usando o Docker e necessário finalizar a instalação dos pré-requisitos abaixo.</b>

- Instalar Docker versão 20.10.11 LTS (ou versão superior LTS)

  - https://docs.docker.com/engine/install/ubuntu/
  - Dar privilégios para o Docker não pedir o “Sudo” durante a execução dos seus comandos.
  - https://docs.docker.com/engine/install/linux-postinstall/ <br/><br />

- Instalar Docker-compose versão 1.29.2 LTS (ou versão superior LTS)

  - https://docs.docker.com/compoexamplese/install/ <br /><br />

- Instalar Build Essentials versão GNU Make 4.2.1 LTS (ou versão superior LTS) para rodar os comandos Make.
  - sudo apt install build-essential <br /><br />

## 4. Clonando o repositório de back-end do projeto SONAR ROTAS

- Clonar o repositório

  - git clone -b develop <endereço-do-repositório>

  - OBS: Por padrão o comando git clone clona a branch main do projeto, quando usamos a tag -b develop estamos clonando diretamente a branch develop.

  - Abrir a pasta clonada
    <br /><br />

## 5. Configurações

- Criar uma base de dados para o projeto SONAR - ROTAS.

- Faça uma cópia do arquivo env.example

- Renomeie a cópia para .env

- Abra o arquivo. env que você acabou de criar e edite as variáveis de ambiente de acordo com as configurações do sistema onde o projeto vai ser instalado.

  - DATABASE_URL=sqlserver://host:port;database=database;user=user;password=password;encrypt=true;trustServerCertificate=true
  - PORT_BACKEND=porta-do-backend
  - NODE_ENV=<'development' | 'production'>
  - SECRET_KEY_ACCESS_TOKEN=secret-jwt

  <br /><br />

- Porta utilizada no back-end: 3051

## 6. Configuração de deploy back-end do projeto SONAR ROTAS usando o Docker

Abra o terminal de comando do Ubuntu e navegue até pasta do projeto e execute o comando make build, conforme exemplo abaixo:

```sh
$ cd <diretorio_do_seu_projeto>
$ make build
```

## Comandos básicos para utilização do SONAR ROTAS back-end no Docker

Para usar os comandos abaixo é necessário abrir o terminal de comando e navegar até a pasta do projeto SONAR - ROTAS back-end.

Executar o comando para buildar e criar o contêiner e iniciar o projeto SONAR - ROTAS back-end.

```sh
make build
```

Parar o serviço do SONAR - ROTAS back-end

```sh
make down

```

Iniciar o serviço do SONAR - ROTAS back-end

```sh
make up
```

Visualizar logs do SONAR - ROTAS back-end

```sh
make logs
```

Baixar atualizações do SONAR - ROTAS back-end (fazer o git pull, criar uma nova build, iniciar o projeto com as novas atualizações)

```sh
make deploy
```

<br>

## 7. Configuração de deploy back-end do projeto SONAR ROTAS usando o Node.js

Executar o comando para instalar as dependências (criar a pasta node_modules) e iniciar o projeto SONAR - ROTAS back-end.

Abra a pasta do projeto com o terminal de comando e execute os comandos:

```sh
$ cd <this repository>
$ yarn
$ yarn start
```

## Comandos básicos para utilização do SONAR ROTAS back-end no Node.Js

Para usar os comandos abaixo é necessário abrir o terminal de comando e navegar até a pasta do projeto SONAR - ROTAS back-end.

Abra a pasta do projeto com o terminal de comando

Executar o comando abaixo para instalar as dependências do projeto SONAR - ROTAS-BACKEND (criar a pasta node modules).

```sh
yarn
```

Executar o comando abaixo para iniciar o projeto SONAR - ROTAS-BACKEND.

```sh
yarn start
```

Executar o comando abaixo para parar o projeto SONAR - ROTAS-BACKEND.

```sh
CTRL+C ou fechar o terminal
```

Para baixar atualizações do SONAR - ROTAS back-end (fazer o git pull, iniciar o projeto com as novas atualizações)

```sh
$ git pull
$ yarn
$ yarn start
```


## Testes E2E: Como executar

São conhecidos como os testes de ponta a ponta, testando uma funcionalidade completa incluindo todas as chamadas: banco de dados, apis etc.  
  
Atualmente, os testes estão configurados apenas para rodar localmente.


### Variáveis de ambiente

Antes de rodar os testes, altere a variável `DATABASE_URL` no arquivo `.env` setando o seu IP local e as credenciais do banco de teste:
```bash
DATABASE_URL=sqlserver://<SEU_IP>:1433;database=rotas;user=sa;password=Admin123;encrypt=true;trustServerCertificate=true
```


### Funcionamento
Execute na primeira vez:

```bash
  yarn pretest:e2e
```

O comando vai criar um banco de dados para teste no Docker se baseando no arquivo `docker-compose.test.yml`.

No terminal vai ser solitado uma confirmação para limpar o banco, visto que ele precisa ser resetado toda vez para os testes:
```bash
[+] Running 2/2
 ✔ Network sonar-rotas-back_default  C...                                    0.0s 
 ✔ Container db-sqlserver-test       Starte...                               0.2s 
Aguardando o servidor SQL Server iniciar...
Banco de dados 'rotas' criado com sucesso!
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQL Server database

? Are you sure you want to reset your database? All data will be lost. › (y/N)
```
Digite sim `(y)`  
As migrações vão ser rodadas e a aplicação vai estar pronta para os testes
```bash
✔ Are you sure you want to reset your database? All data will be lost. … yes

Applying migration `20230713182418_v2_5`
Applying migration `20230725145322_create_table_scheduled_work`
Applying migration `20230817133844_`
Applying migration `20230824134022_`

Database reset successful

The following migration(s) have been applied:

migrations/
  └─ 20230713182418_v2_5/
    └─ migration.sql
  └─ 20230725145322_create_table_scheduled_work/
    └─ migration.sql
  └─ 20230817133844_/
    └─ migration.sql
  └─ 20230824134022_/
    └─ migration.sql

✔ Generated Prisma Client (v5.2.0) to ./node_modules/@prisma/client in 186ms

Reset de migrações do Prisma concluído!
$ npx prisma migrate deploy
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQL Server database

4 migrations found in prisma/migrations


No pending migrations to apply.
✨  Done in 33.72s.
```
Agora execute o comando para rodar os testes
```bash
yarn test:e2e
```
Depois de pedir as mesmas permissões do comando `yarn pretest:e2e`, os testes vão rodar:
```bash
$ MOCK_SERVER=true jest --config ./test/jest-e2e.json --runInBand --forceExit
 PASS  test/route.e2e-spec.ts (7.528 s)
  Route Controller (e2e)
    create conventional route
      ✓ should be able to list all employees (86 ms)
      ✓ should be able to create a conventional route (903 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        7.603 s, estimated 8 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
✨  Done in 49.74s.
```
