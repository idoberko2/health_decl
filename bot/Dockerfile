FROM node:alpine

# Create app directory
RUN mkdir /app

# Dokku related files
COPY Procfile /app/Procfile
COPY DOKKU_SCALE /app/DOKKU_SCALE

# Install dependecies first for caching
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install --frozen-lockfile

# Copy the rest of the files
COPY bin /app/bin
COPY rabbit_config.js /app
COPY consts.js /app

CMD ["node", "/app/bin/bot_listener"]
