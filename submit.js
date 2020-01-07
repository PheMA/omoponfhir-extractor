const fs = require("fs").promises;
const fetch = require("node-fetch");
const mapLimit = require("async/mapLimit");

const dataDir = "./bundles/submit";
const fhirBaseUrl = "http://local.psbrandt.io:9876/hapi-fhir-jpaserver/fhir";
const batchSize = 10;

const submitBundle = (bundle, filename) => {
  console.log(`Submitting ${filename}`);

  return fetch(fhirBaseUrl, {
    method: "post",
    body: bundle,
    headers: { "Content-Type": "application/fhir+json" }
  }).then(res => {
    console.log(
      `Submitting ${filename} completed with response code ${res.status}`
    );

    return res.status;
  });
};

const submitBatches = bundleFilenames => {
  mapLimit(
    bundleFilenames,
    batchSize,
    async function(bundleFilename) {
      console.log(`Reading ${dataDir}/${bundleFilename}`);

      return fs
        .readFile(`${dataDir}/${bundleFilename}`)
        .then(bundle => submitBundle(bundle, bundleFilename));
    },
    (err, results) => {
      if (err) throw err;
      // results is now an array of the response bodies
      console.log(results);
    }
  );
};

const submit = () => {
  const bundleFilenames = [];

  fs.readdir(dataDir)
    .then(items => {
      items.forEach(item => {
        bundleFilenames.push(item);
      });

      submitBatches(bundleFilenames);
    })
    .catch(e => {
      console.log(`Error submitting: ${e}`);
    });
};

submit();
