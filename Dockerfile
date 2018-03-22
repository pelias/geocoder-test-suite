# base image
FROM pelias/baseimage

# change working dir
ENV WORKDIR /code/pelias/geocoder-test-suite
WORKDIR ${WORKDIR}

# copy code into image
ADD . ${WORKDIR}

# install npm dependencies
RUN npm install

# run tests
RUN npm test