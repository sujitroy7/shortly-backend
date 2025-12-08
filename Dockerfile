FROM node:20

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . ./

EXPOSE 8000

CMD [ "pnpm", "dev" ]