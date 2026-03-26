# Stage 1: Build
FROM oven/bun:latest AS builder

WORKDIR /src

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the Nuxt application
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest AS runner

WORKDIR /src

# Set production environment
ENV VITE_ENV_BASE_API=${VITE_ENV_BASE_API}

# Only copy the necessary build output from the builder stage
# Nuxt outputs the standalone server to .output
COPY --from=builder /src/.output ./.output

# Expose the default Nuxt port
EXPOSE 5000

# Start the server using Bun
CMD ["bun", ".output/server/index.mjs"]