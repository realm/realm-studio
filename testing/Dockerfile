FROM electronuserland/builder:wine-chrome

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --quiet
RUN cp -a /tmp/node_modules /project/
