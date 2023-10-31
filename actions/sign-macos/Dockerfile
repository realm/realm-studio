FROM ubuntu:20.04
USER root

WORKDIR /macnotary/work
ARG MACNOTARY_BIN=/macnotary/bin
ARG DEBIAN_FRONTEND=noninteractive

RUN mkdir -p /macnotary/work && mkdir -p /macnotary/bin
RUN apt-get update && apt-get -y install curl unzip
RUN curl -LO https://macos-notary-1628249594.s3.amazonaws.com/releases/client/latest/linux_amd64.zip && \
    unzip linux_amd64.zip && mv linux_amd64/macnotary ${MACNOTARY_BIN}/ && rmdir linux_amd64
COPY run.sh /run.sh
ENV PATH="${MACNOTARY_BIN}:${PATH}"

#ENTRYPOINT /run.sh