FROM lambci/lambda:build-nodejs12.x

WORKDIR /src/

COPY package.json yarn.lock /src/
RUN npm install -g yarn
RUN yarn install --frozen-lockfile

COPY . .

CMD yarn start