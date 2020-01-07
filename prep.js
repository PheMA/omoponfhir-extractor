const fs = require("fs");
const mkdirp = require("mkdirp");

const bundleDir = "bundles/Bundle";
const saveDir = "bundles/submit";

const saveBundle = (bundle, id) => {
  mkdirp(saveDir, err => {
    const filename = `Bundle.${id}.submit.json`;

    fs.writeFile(
      `${saveDir}/${filename}`,
      JSON.stringify(bundle, null, 2),
      err => {
        if (err) throw err;
        console.log(`Wrote: ${saveDir}/${filename}`);
      }
    );
  });
};

const prepBundle = bundle => {
  const submitBundle = {
    resourceType: "Bundle",
    type: "batch"
  };

  submitBundle.entry = bundle.entry.map(entry => {
    return {
      request: {
        method: "PUT",
        url: `${entry.resource.resourceType}/${entry.resource.id}`
      },
      resource: entry.resource
    };
  });

  saveBundle(submitBundle, bundle.id);
};

const prep = () => {
  fs.readdir(bundleDir, function(err, items) {
    items.forEach(item => {
      fs.readFile(`${bundleDir}/${item}`, (err, data) => {
        if (err) throw err;

        const bundle = JSON.parse(data);

        prepBundle(bundle);
      });
    });
  });
};

prep();
