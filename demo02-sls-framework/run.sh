#instalar 
npm i -g serverless

#sls inicializar
sls

#sempre fazer deploy do ambiente para verificar funcionamentos
sls deploy

#invocar na aws
sls invoke -f hello

#invocar na local
sls invoke local -f hello --log

#configurar dashboard
sls

#logs
sls logs -f hello --tail

#remover 
sls remove