FROM idoberko2/nightmare

# Create app directory
RUN mkdir /app

# Install dependecies first for caching
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install --frozen-lockfile

# Copy the rest of the files
COPY bin /app/bin
COPY src /app/src

# xvfb related file
COPY entrypoint.sh /entrypoint
RUN chmod +x /entrypoint

ENTRYPOINT ["/entrypoint"]
