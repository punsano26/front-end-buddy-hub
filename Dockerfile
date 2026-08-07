# Stage 1: Build
FROM oven/bun:latest AS builder

# 1. Declare the ARG so Docker can receive it
ARG VITE_ENV_BASE_API
ARG VITE_ENV_BASE_WS_API
ARG NUXT_PUBLIC_SITE_URL
ARG VITE_ENV_BASE_FILE_URL
ARG NUXT_PUBLIC_STRIPE_PK
# 2. Set it as an ENV so the 'bun run build' process can see it
ENV VITE_ENV_BASE_API=$VITE_ENV_BASE_API
ENV VITE_ENV_BASE_WS_API=$VITE_ENV_BASE_WS_API
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV VITE_ENV_BASE_FILE_URL=$VITE_ENV_BASE_FILE_URL
ENV NUXT_PUBLIC_STRIPE_PK=$NUXT_PUBLIC_STRIPE_PK

WORKDIR /src
COPY package.json bun.lock ./ 
RUN bun install --frozen-lockfile

COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest AS runner
WORKDIR /src

# If your Nuxt app needs this at runtime (server-side), 
# you must re-declare the ARG and ENV here too.
ARG VITE_ENV_BASE_API
ARG VITE_ENV_BASE_WS_API
ARG NUXT_PUBLIC_SITE_URL
ARG VITE_ENV_BASE_FILE_URL
ARG NUXT_PUBLIC_STRIPE_PK
ENV VITE_ENV_BASE_API=$VITE_ENV_BASE_API
ENV VITE_ENV_BASE_WS_API=$VITE_ENV_BASE_WS_API
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV VITE_ENV_BASE_FILE_URL=$VITE_ENV_BASE_FILE_URL

COPY --from=builder /src/.output ./.output

EXPOSE 5000
CMD ["bun", ".output/server/index.mjs"]