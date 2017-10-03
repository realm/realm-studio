FROM electronuserland/builder:wine-chrome

WORKDIR /tmp
ENV HOME /home/realm-studio
ENV USER realm-studio
ENV PATH ./node_modules/.bin/:$PATH

RUN adduser \
  --gecos "" --disabled-password \
  -u 1014 $USER

RUN mkdir /tmp/node_modules \
  && chown -R $USER:$USER /tmp

RUN npm install --quiet --no-shrinkwrap
