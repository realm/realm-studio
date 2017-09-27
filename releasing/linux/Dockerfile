FROM alanfranz/fwd-centos-6:latest

ARG PACKAGECLOUD_URL

ENV NPM_CONFIG_UNSAFE_PERM true

# Install EPEL & devtoolset
# On CentOS6, there is a bug with OverlayFS and Docker. It is needed to touch
# /var/lib/rpm/* in order to work around this issue.
# Link: https://github.com/docker/docker/issues/10180

RUN touch /var/lib/rpm/* \
    && yum -y install \
        epel-release \
        centos-release-scl-rh \
    && yum-config-manager --enable rhel-server-rhscl-6-rpms \
    && curl -s $PACKAGECLOUD_URL/script.rpm.sh | bash \
    && yum -y install \
        python27 \
        which \
        chrpath \
        openssl-devel \
        devtoolset-3-gcc \
        devtoolset-3-gcc-c++ \
        devtoolset-3-binutils \
        libconfig-devel \
        jq \
    && yum remove -y g++ gcc \
    && yum clean all

ENV NVM_DIR /tmp/.nvm
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
RUN . $NVM_DIR/nvm.sh && \
    nvm install 8.4.0
RUN chmod a+rwX -R $NVM_DIR

ARG REALM_SYNC_VERSION
RUN yum clean all && \
    yum install -y \
    realm-sync-devel-$(echo ${REALM_SYNC_VERSION/\-/\_} | sed 's/-\([^g]\)/~\1/g') \
    realm-sync-node-devel-$(echo ${REALM_SYNC_VERSION/\-/\_} | sed 's/-\([^g]\)/~\1/g')

# Get rid of the core dynamic library otherwise the build will link to it instead of the static one
RUN rm /usr/lib64/librealm.so

# Install the dependencies that electron-builder has on the environment
# @see https://github.com/electron-userland/electron-builder/issues/2078
# - icns2png
# RUN yum clean all && \
#   yum install -y \
#   libicns \
#   libicns-utils

# Put gcc 4.9 in path
ENV PATH="/opt/rh/devtoolset-3/root/usr/bin:${PATH}"

VOLUME /src
WORKDIR /src

ENTRYPOINT ["/bin/bash", "releasing/linux/build-inside.sh"]
