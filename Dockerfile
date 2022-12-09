FROM node:14-alpine3.15 AS builder
RUN apk update && apk add --no-cache build-base python3 llvm10-libs bash git

WORKDIR /usr/src/
COPY . .
RUN yarn install && yarn build

FROM node:14-alpine3.15
RUN apk update && apk add --no-cache llvm10-libs
COPY --from=builder /usr/src /usr/src
WORKDIR /usr/src/sriracha
CMD ["yarn", "start"]
EXPOSE 8082