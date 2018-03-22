'use strict';

const csv_parse = require('csv-parse');
const fs = require('fs-extra');
const through = require('through2');

const config = require('pelias-config').generate()['acceptance-tests'];

if (!config.generateTests.inputCSVFile && process.argv.length < 3) {
  console.log('Error: missing CSV filename parameter! specify on the command line or via Pelias config file.');
  console.log('Usage: "npm make-tests -- path/to/input-file.csv');
  process.exit(1);
}

const csv_parser = csv_parse({ delimiter: ',', columns: true});
const filename = config.generateTests.inputCSVFile || process.argv[2];
const read_stream = fs.createReadStream(filename);
const outputDir = config.generateTests.outputTestDir || './tests';

const test_suite_json = {
  name: 'replace me',
  description: 'acceptance tests used to validate geocoding quality in Portland, OR',
  source: 'replace me',
  priorityThresh: 1,
  normalizers: {
    name: ['toUpperCase', 'removeOrdinals', 'stripPunctuation', 'abbreviateDirectionals', 'abbreviateStreetSuffixes']
  },
  tests: []
};

const testCaseStream = through.obj( (record, encoding, callback) => {
  const testCase = {
    id: record.Location_ID,
    user: 'TriMet',
    status: 'pass',
    type: record.Type,
    description: `sourced from ${record.Source}`,
    expected: {
      distanceThresh: config.generateTests.distanceThresh || 150, // distance in meters
      properties: [{
        locality: record.City,
        region_a: record.State
      }],
      coordinates: [
        [record.Lon, record.Lat]
      ]
    }
  };

  if (record.Request === 'Name + City') {
    testCase.in = {
      text: `${record.Name}, ${record.City}`
    };
    testCase.expected.properties[0].layer = 'venue';
    testCase.expected.properties[0].name = record.Name;
  }
  else if (record.Request === 'Full Address') {
    testCase.in = {
      text: `${record.House_Number} ${record.Street_Name} ${record.Street_Type}` +
      ` ${record.Unit_Number} ${record.Unit_Type}, ${record.City} ${record.Zip}`
    };
    testCase.expected.properties[0].layer = 'address';
    testCase.expected.properties[0].housenumber = record.House_Number;
    testCase.expected.properties[0].street = `${record.Street_Name} ${record.Street_Type}`;
  }

  const testSuite = test_suite_json;

  testSuite.name = `${record.Category}: ${record.Type}`;
  testSuite.tests = [ testCase ];
  testSuite.source = record.Source;

  fs.ensureDirSync(outputDir);
  fs.writeFileSync(`${outputDir}/${testCase.type}: ${testCase.id}.json`, JSON.stringify(testSuite, null, 2));

  callback();
});


read_stream
  .pipe(csv_parser)
  .pipe(testCaseStream)
  .on('finish', () => {
    console.log('All Done!');
  });
