>This repository is part of the [Pelias](https://github.com/pelias/pelias) project. Pelias is an
>open-source, open-data geocoder built by [Mapzen](https://www.mapzen.com/) that also powers
>[Mapzen Search](https://mapzen.com/projects/search). Our official user documentation is
>[here](https://mapzen.com/documentation/search/).

# Pelias Geocoder Test Suite

[![Greenkeeper badge](https://badges.greenkeeper.io/pelias/geocoder-test-suite.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/pelias/geocoder-test-suite.svg?branch=master)](https://travis-ci.org/pelias/geocoder-test-suite)

## Generate Tests
Tests can be auto-generated from a CSV file with the following schema. These are the minimum expected columns and all other columns will be skipped.
Please see the included sample input file under `etc/sample-input-file-TriMet.csv`.

```
Location_ID,Category,Type,Source,Name,Prefix,House_Number,Unit_Type,Unit_Number,Street_Name,Street_Type,City,State,Zip,Stop_ID,X_Coord,Y_Coord,Lat,Lon,Request
1,POI,Top User Submissions,Log Files,PDX,NE,7000,,,Airport,Way,Portland,OR,97218,,,,45.5897694,-122.5950942,Name + City
2,POI,Top User Submissions,Log Files,OHSU,SW,3181,,,Sam Jackson Park,Rd,Portland,OR,97239,,,,45.4999342,-122.6854635,Name + City
3,POI,Top User Submissions,Log Files,PSU,SW,1825,,,,Broadway,Portland,OR,97201,,,,45.5117567,-122.6842859,Name + City
```

To generate the tests, call the test generation script with the path to the prepared CSV file. This process will create a new `./tests` directory and place all the generated test suite files under it. The files will be grouped into subfolders by the value of the `Type` column. This will allow us to run subgroups of tests as opposed to having to run the entire suite each time.

You can also use the Pelias config file to specify the location of the input CSV file as well as other test parameters. Please see the included sample config file under `etc/sample-pelias-config.json`.

`PELIAS_CONFIG=./config.json npm run make-tests`

### Execute Tests
In order to run the test suite simply use the `npm start` command with a path to the directory containing all the test suite files.
Specifying the `-o csv` parameter will generate a CSV containing simplified test result output. The results will contain input and actual first result along with distance, in meters, from the expected location.

`npm start -- -o csv ./tests/Landmarks/*`
   
   
   