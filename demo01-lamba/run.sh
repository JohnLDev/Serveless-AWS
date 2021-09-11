# 1° criar arquivo de politicas
# 2° criar role de segurança na aws
aws iam create-role \
  --role-name lambda-exemplo1 \
  --assume-role-policy-document file://politicas.json \
  | tee logs/role.log


  #3° criar arquivo com conteudo e zipa-lo

  zip function.zip index.js

  aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs14.x \
    --role arn:aws:iam::851996801877:role/lambda-exemplo1 \
    | tee logs/lambda-create.log

#4° invoke lambda
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log

#--atualizar, zipar
zip function.zip index.js

# atualizar lambda
aws lambda update-function-code \
 --function-name hello-cli \
 --zip-file fileb://function.zip \
 --publish \
 | tee logs/lambda-update.log

 #invocar e ver resultado

aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec-update.log