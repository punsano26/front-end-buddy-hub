# Stage 1: Build
FROM oven/bun:latest AS builder

# 1. Declare the ARG so Docker can receive it
ARG VITE_ENV_BASE_API
ARG VITE_ENV_BASE_WS_API
ARG NUXT_PUBLIC_SITE_URL
# 2. Set it as an ENV so the 'bun run build' process can see it
ENV VITE_ENV_BASE_API=$VITE_ENV_BASE_API
ENV VITE_ENV_BASE_WS_API=$VITE_ENV_BASE_WS_API
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

WORKDIR /src
COPY package.json bun.lock ./ 
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest AS runner
WORKDIR /src

# If your Nuxt app needs this at runtime (server-side), 
# you must re-declare the ARG and ENV here too.
ARG VITE_ENV_BASE_API
ARG VITE_ENV_BASE_WS_API
ARG NUXT_PUBLIC_SITE_URL
ENV VITE_ENV_BASE_API=$VITE_ENV_BASE_API
ENV VITE_ENV_BASE_WS_API=$VITE_ENV_BASE_WS_API

COPY --from=builder /src/.output ./.output

EXPOSE 5000
CMD ["bun", ".output/server/index.mjs"]