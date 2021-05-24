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
    "-c, --combine-duplicated-selectors",
    "Combine duplicated selectors in input CSS"
  )
  .option("-p, --purify", "Purify CSS with html file");

cli.help();
cli.version("0.1.0");

const args = cli.parse();
console.log(args);

if (!fs.existsSync(args.options.input)) {
  console.log("Input file is not found");
  process.exit(1);
}
let inputCSS = fs.readFileSync(args.options.input).toString();

if (!args.options.output) {
  console.log("Output file is required");
  process.exit(1);
}

let postCSSOptions = [];
if (args.options.discardComments) {
  postCSSOptions.push(require("postcss-discard-comments"));
}
if (args.options.expandSelectors) {
  postCSSOptions.push(require("postcss-expand-selectors"));
}
if (args.options.combineDuplicatedSelectors) {
  postCSSOptions.push(require("postcss-combine-duplicated-selectors"));
}

if (!postCSSOptions.length) {
  console.log("You need to specify at least one postcss options.");
  process.exit(1);
}

postcss(postCSSOptions)
  .process(inputCSS, {from: args.options.input})
  .then((result) => {
    if (args.options.purify) {
      if (!fs.existsSync(args.options.html)) {
        console.log("You need to specify html file to use purify option")
        process.exit(1);
      }
      let html = fs.readFileSync(args.options.html).toString();
      let out = purify(html, result.css);
      fs.writeFileSync(args.options.output, out);
    } else {
      fs.writeFileSync(args.options.output, result.css);
    }
  });
