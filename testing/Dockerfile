FROM electronuserland/builder:wine-chrome

ENV PATH ./node_modules/.bin/:$PATH

RUN adduser --gecos "" --disabled-password -u 1014 realm-studio

RUN mkdir /tmp/node_modules \
 && chown -R realm-studio:realm-studio /tmp

RUN cd /tmp \
 && npm install --quiet --no-shrinkwrap
