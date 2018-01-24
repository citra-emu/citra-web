FROM mhart/alpine-node:latest

# Create app directory
WORKDIR /usr/src/site

# Install app dependencies
COPY . .

# Bootstrap website
RUN apk update
RUN apk add graphicsmagick
RUN npm install -g hugo-bin
RUN npm install -g gulp
RUN npm install

EXPOSE 3000

# And build it
CMD ["gulp", "all"]
