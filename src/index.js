const fs = require("fs");
const postcss = require("postcss");
const { exit } = require("process");
const purify = require("purify-css");
const cli = require("cac")();
cli
  .option("--output <file>", "Choose a output css file name")
  .option("--input <file>", "Choose a input file name")
  .option("--html <file>", "Choose a html file")
  .option("-d, --discard-comments", "Discard input CSS comments")
  .option("-e, --expand-selectors", "Expand selectors in input CSS")
  .option(
    "-m, --combine-media-query",
    "Combine duplicated media queries in input CSS"
  )
  .option(
    "-c, --combine-duplicated-selectors",
    "Combine duplicated selectors in input CSS"
  )
  .option("-p, --purify", "Purify CSS with html file")
  .command("parse", "parse css")
  .action((options) => {
    if (!fs.existsSync(options.input)) {
      console.log("Input file is not found");
      process.exit(1);
    }
    let inputCSS = fs.readFileSync(options.input).toString();

    if (!options.output) {
      console.log("Output file is required");
      process.exit(1);
    }

    let postCSSOptions = [];
    if (options.discardComments) {
      postCSSOptions.push(
        require("postcss-discard-comments")({ removeAll: true })
      );
    }
    if (options.expandSelectors) {
      postCSSOptions.push(require("postcss-expand-selectors"));
    }
    if (options.combineMediaQueries) {
      postCSSOptions.push(require("postcss-combine-media-query"));
    }
    if (options.combineDuplicatedSelectors) {
      postCSSOptions.push(require("postcss-combine-duplicated-selectors"));
    }

    if (!postCSSOptions.length) {
      console.log("You need to specify at least one postcss options.");
      process.exit(1);
    }

    postcss(postCSSOptions)
      .process(inputCSS, { from: options.input })
      .then((result) => {
        let out = result.css;
        if (options.purify) {
          if (!fs.existsSync(options.html)) {
            console.log("You need to specify html file to use purify option");
            process.exit(1);
          }
          let html = fs.readFileSync(options.html).toString();
          out = purify(html, out);
        }
        fs.writeFileSync(options.output, out);
        console.log("CSS is successfully written in " + options.output);
      });
  });

cli.help();
cli.version("0.1.0");
cli.parse();
