#!/bin/bash

sleep 7

# Variáveis de conexão
server="localhost"
user="sa"
password="Admin123"
database="rotas"

# Comando SQL para criar o banco de dados
sql_query="CREATE DATABASE $database;"

# Executar o comando SQL usando sqlcmd
sqlcmd -S $server -U $user -P $password -Q "$sql_query"
