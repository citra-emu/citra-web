FROM library/ubuntu:artful

# Create app directory
WORKDIR /usr/src/site

# Install app dependencies
COPY . .

# Bootstrap website
RUN apt-get update && \
    apt-get install --yes graphicsmagick && \
    apt-get install --yes wget && \
    wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v0.31.1/hugo_0.31.1_Linux-64bit.deb && \
    dpkg -i hugo.deb && \
    apt-get install --yes curl && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install --yes nodejs && \
    npm install -g gulp && \
    npm install

EXPOSE 3000

# And build it
CMD ["gulp", "all"]
