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
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.listapt-get update && \
    apt-get update && \
    apt-get install --yes yarn && \
    yarn global add gulp && \
    yarn install

EXPOSE 3000

# And build it
CMD ["gulp", "all"]
