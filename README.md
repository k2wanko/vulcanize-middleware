
# [vulcanize](https://github.com/Polymer/vulcanize)-middleware

Concatenate a set of Web Components into one file for express.

## install

```sh
$ npm install --save vulcanize-middleware
```

## Usage

```js

var express = require('express');
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

var public_dir = path.join(__dirname, "public");
app.use(express.static(public_dir));
app.use(require("vulcanize-middleware")({dest: public_dir}));

```

## License

MIT © k2lab.net
