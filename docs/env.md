# Sonar Rotas Back-End Environment Variables

![ROTAS](/uploads/e44c21637ef17a54a11b36ace6f005fb/ROTAS.png)

A guide for configuring your back-end.

### How to read

Variables should be formatted in a dotenv-like file.

There are some differences that should be considered:

```shell
# Variables starting with "*" are REQUIRED
*DATABASE_URL=

# Variables with values are OPTIONAL and has a default value
EXAMPLE=PRIVACY_POLICY

# Variables without "*" are OPTIONAL and can be blank
CORE_API_URL=
```

### Index

- [Server configuration](#server-configuration)
- [Authentication configuration](#authentication-configuration)
- [Provider: Google Maps](#provider-google-maps)
- [Provider: MapBox](#provider-mapbox)
- [Populate Database](#encryption-configuration)
- [SqlServer connection](#sqlserver-connection)
- [Crons configuration](#crons-configuration)

### Server configuration

```shell
# Values: development or production
# In mode development the authentication JWT will be disable
*NODE_ENV=<STRING>

# Values: type number. Port to access application local or from Docker
*PORT_BACKEND=<NUMBER>ww
```

### Authentication configuration

```shell
# Secret to encode and decode JWT tokens
*SECRET_KEY_ACCESS_TOKEN=<STRING>
```

### Provider: Google Maps

```shell
# Api key to application use map services
*MAP_BOX_API_KEY=<STRING>
```

### Provider: MapBox

```shell
# Api key to application use map services
*GOOGLE_MAPS_API_KEY=<STRING>
```

### Populate Database

```shell
# UUID entity Denso on server
*DENSO_ID=<STRING>
```

### Crons configuration

```shell
# Pay attention to format time to set cron

# Job to update finished routes to pending
TIME_TO_UPDATE_JOB_UPDATE_STATUS=<'* * * * * *'>

# Job to execute each time to finish routes not finisheds
TIME_TO_UPDATE_JOB_FINISH_ROUTES=<'* * * * * *'>

# Duration in hours after started route to finish her
TIME_LIMIT_TO_FINISH_ROUTE_IN_HR=<NUMBER>
```

### SqlServer connection

```shell
*DATABASE_URL=sqlserver://<IP>:<PORT>;database=<DATABASE_NAME>;user=<DATABASE_USER>;password=<DATABASE_PASSWORD>;encrypt=true;trustServerCertificate=true
```