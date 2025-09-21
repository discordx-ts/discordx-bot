## build runner
FROM node:lts-alpine as build-runner

# Enable corepack (manages pnpm/yarn versions)
RUN corepack enable

# Set temp directory
WORKDIR /tmp/app

# Move package files
COPY package.json pnpm-lock.yaml ./

# Install required tools
RUN apk add --no-cache make gcc g++ python3

# Install dependencies (including dev)
RUN pnpm install

# Move source files
COPY src ./src
COPY tsconfig.json ./

# Build project
RUN pnpm build

## production runner
FROM node:lts-alpine as prod-runner

# Enable corepack
RUN corepack enable

# Set work directory
WORKDIR /app

# Copy package.json + lockfile from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/pnpm-lock.yaml /app/pnpm-lock.yaml

# Install required tools
RUN apk add --no-cache make gcc g++ python3

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "pnpm", "start" ]
