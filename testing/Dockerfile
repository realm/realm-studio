FROM electronuserland/builder:wine-chrome

WORKDIR /project
ENV HOME /project
ENV USER realm-studio

RUN adduser \
  --gecos "" --disabled-password \
  --home=/project --no-create-home \
  -u 1014 $USER && chown -R $USER:$USER /project
