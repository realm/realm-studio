FROM electronuserland/builder:wine-chrome

WORKDIR /project
ENV HOME /home/realm-studio
ENV USER realm-studio
ENV PATH ./node_modules/.bin/:$PATH

RUN adduser \
  --gecos "" --disabled-password \
  -u 1014 $USER

RUN mkdir /project/node_modules \
  && chown -R $USER:$USER /project

RUN npm install --quiet
