# build stage
FROM node:lts-alpine AS build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG VITE_SPECIAL_DAY
ENV VITE_SPECIAL_DAY=${VITE_SPECIAL_DAY}

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
