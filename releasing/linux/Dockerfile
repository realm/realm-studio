FROM centos:7

ARG PACKAGECLOUD_URL
ARG REALM_SYNC_VERSION

ENV NPM_CONFIG_UNSAFE_PERM true

RUN yum install -y \
      epel-release \
      centos-release-scl-rh \
    && yum-config-manager --enable rhel-server-rhscl-7-rpms \
    && curl -s $PACKAGECLOUD_URL/script.rpm.sh | bash \
    && yum install -y \
        python27 \
        wget \
        which \
        chrpath \
        openssl-devel \
        devtoolset-3-gcc \
        devtoolset-3-gcc-c++ \
        devtoolset-3-binutils \
        libconfig-devel \
        jq \
    && yum install -y \
      realm-sync-devel-$(echo ${REALM_SYNC_VERSION/\-/\_} | sed 's/-\([^g]\)/~\1/g') \
      realm-sync-node-devel-$(echo ${REALM_SYNC_VERSION/\-/\_} | sed 's/-\([^g]\)/~\1/g') \
    && yum clean all

# Get rid of the core dynamic library otherwise the build will link to it instead of the static one
RUN rm /usr/lib64/librealm.so

# TODO: Install the dependencies that electron-builder has on the environment
# @see https://github.com/electron-userland/electron-builder/issues/2078

# Put devtoolset-3's gcc in path
ENV PATH="/opt/rh/devtoolset-3/root/usr/bin:${PATH}"

# Install node in a specific version
ENV NVM_DIR /tmp/.nvm
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
RUN . $NVM_DIR/nvm.sh && \
    nvm install 8.4.0
RUN chmod a+rwX -R $NVM_DIR

VOLUME /src
WORKDIR /src

ENTRYPOINT ["/bin/bash", "releasing/linux/build-inside.sh"]
