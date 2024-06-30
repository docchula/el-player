# build stage
FROM node:lts-alpine as build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]