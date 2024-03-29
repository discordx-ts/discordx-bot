## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

# Install required tools
RUN apk add make gcc g++ python3

# Install dependencies
RUN npm install

# Move source files
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN npm run build

## producation runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

# Install required tools
RUN apk add make gcc g++ python3

# Install dependencies
RUN npm install --only=production && npm cache clean --force

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "npm", "run", "start" ]
