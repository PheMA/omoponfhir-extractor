const fetch = require("node-fetch");
const mkdirp = require("mkdirp");
const fs = require("fs");

const resources = ["Patient", "Encounter", "Condition", "Procedure"];
const count = 1000;

const fhirBaseUrl =
  "http://local.psbrandt.io:9876/omoponfhir-stu3-server/fhir/";

const dataDir = "bundles";

const findNext = links => {
  const next = links.find(link => link.relation === "next");

  return !next ? next : next.url;
};

const saveResource = resource => {
  const type = resource.resourceType;
  const id = resource.id;

  const dirName = `${dataDir}/${type}`;

  mkdirp(dirName, err => {
    const filename = `${type}.${id}.json`;

    fs.writeFile(
      `${dirName}/${filename}`,
      JSON.stringify(resource, null, 2),
      err => {
        if (err) throw err;
        console.log(`Wrote: ${dirName}/${filename}`);
      }
    );
  });
};

const extractBundle = bundle => {
  saveResource(bundle);

  return findNext(bundle.link);
};

const extractResource = async resource => {
  let next = `${fhirBaseUrl}/${resource}?_count=${count}`;

  do {
    console.log(`Fetching ${next}`);

    next = await fetch(next)
      .then(res => res.json())
      .then(bundle => extractBundle(bundle));
  } while (next != null);
};

const extract = () => {
  resources.forEach(resource => {
    extractResource(resource);
  });
};

extract();
