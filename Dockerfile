FROM library/node:8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
RUN apk update
RUN apk add graphicsmagick
RUN npm install -g hugo-bin
RUN npm install -g gulp

# Bootstrap website
COPY . .
RUN npm install

EXPOSE 3000

CMD ["gulp", "all"]
