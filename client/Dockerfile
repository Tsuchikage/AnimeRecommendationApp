FROM node:18-alpine

WORKDIR /app

COPY ./src .

ARG SERVER_URL

RUN yarn global add pnpm && pnpm i

RUN pnpm run build

CMD ["pnpm", "start"]