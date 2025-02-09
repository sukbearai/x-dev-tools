FROM harbor.meta.com/tools/node:22.13.0

ENV NODE_ENV=production

ENV HOST 0.0.0.0

RUN mkdir -p /nuxt3

COPY ./ . /nuxt3/

WORKDIR /nuxt3

EXPOSE 3000

CMD ["node","./.output/server/index.mjs"]