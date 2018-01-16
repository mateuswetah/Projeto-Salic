#### Creates an environement containing Node, NPM and Angular. 

FROM node:9.4.0

ENV ANGULAR_CLI_VERSION=1.6.1

### Python, & Git -------------------------------------------------

RUN apt-get -qq update && \
		apt-get -qq install -y python && \
		rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
		apt-get autoremove -y && \
		apt-get clean

### Angular ---------------------------------------------

COPY package.json /home/node/Projeto-Salic/package.json
WORKDIR /home/node/Projeto-Salic
RUN npm install && npm install --unsafe-perm -g @angular/cli@$ANGULAR_CLI_VERSION findup-sync typescript && \
 npm cache verify

### Final setup--------------------------------------------------

EXPOSE 4200
CMD npm install && ng serve --host 0.0.0.0
