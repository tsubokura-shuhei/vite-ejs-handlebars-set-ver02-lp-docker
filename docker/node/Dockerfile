FROM debian
RUN set -ex; \
    \
    apt-get update; \
    apt-get install -y wget ;\
    apt-get install -y vim;

# nodebrew + nodejs
ENV NODE_VERSION v18.15.0
RUN wget git.io/nodebrew
RUN perl nodebrew setup
ENV PATH $HOME/.nodebrew/current/bin:$PATH
RUN echo 'export PATH="$HOME/.nodebrew/current/bin:$PATH"' >> $HOME/.bashrc
RUN . $HOME/.bashrc && nodebrew install-binary $NODE_VERSION
RUN . $HOME/.bashrc && nodebrew use $NODE_VERSION