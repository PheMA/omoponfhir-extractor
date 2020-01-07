# OMOP on FHIR Data Extractor

Tool for pulling OMOP data out as FHIR Bundle resources.

To extract data, first edit [`index.js`](index.js) and update the value of
`fhirBaseUrl` as needed. Then run:

```
$ node index.js
```

Then, convert the search result bundles to batch bundles by running:

```sh
$ node prep.js
```

Finally, submit the bundles to your FHIR server of choice by running:

```sh
$ node submit.js
```