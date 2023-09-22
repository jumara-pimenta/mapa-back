#!/bin/bash

# Variáveis de conexão
server="localhost"
user="sa"
password="Admin123"
database="rotas"

# Esperar até que o servidor SQL Server esteja disponível
echo "Aguardando o servidor SQL Server iniciar..."
while ! sqlcmd -S $server -U $user -P $password -Q "SELECT 1;" &> /dev/null; do
    sleep 1
done

# Comando SQL para criar o banco de dados
sql_query="CREATE DATABASE IF NOT EXISTS $database;"

# Executar o comando SQL usando sqlcmd
sqlcmd -S $server -U $user -P $password -Q "$sql_query"

echo "Banco de dados '$database' criado com sucesso!"

# Após a criação do banco de dados, execute o comando Prisma
npx prisma migrate reset --force

echo "Reset de migrações do Prisma concluído!"
