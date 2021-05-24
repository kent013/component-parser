# css-parser

```
% node src/index.js -h
index.js/0.1.0

Usage:
  $ index.js <command> [options]

Commands:
  parse  parse css

For more info, run any command with the `--help` flag:
  $ index.js parse --help

Options:
  --output <file>                     Choose a output css file name
  --input <file>                      Choose a input file name
  --html <file>                       Choose a html file
  -d, --discard-comments              Discard input CSS comments
  -e, --expand-selectors              Expand selectors in input CSS
  -m, --combine-media-query           Combine duplicated media queries in input CSS
  -c, --combine-duplicated-selectors  Combine duplicated selectors in input CSS
  -p, --purify                        Purify CSS with html file
  -h, --help                          Display this message
  -v, --version                       Display version number
```

# example
  
```
node src/index.js parse --input style.css --output notification.css --html notification.html -d -c -e -m -p
```