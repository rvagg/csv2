# csv2

[![Build Status](https://secure.travis-ci.org/rvagg/csv2.png)](http://travis-ci.org/rvagg/csv2)

[![NPM](https://nodei.co/npm/csv2.png?compact=true)](https://nodei.co/npm/csv2/) 

**A Node Streams2 CSV parser**

Will parse an input character stream and pass on an array for each line of CSV data.

**csv2** can handle basic CSV quoting and escaping: `foo,"bar","wut? ""whoa!""","commas, in, my, strings??"`

The only main "feature" not currently supported is newlines within quoted strings; newlines are treated strictly as row separators.

```js
fs.createReadStream('data.csv')
  .pipe(csv2())
  .on('data', console.log)
```

Or, use [through2](https://github.com/rvagg/through2) to transform your CSV into JSON:

```js
fs.createReadStream('data.csv')
  .pipe(csv2())
  .pipe(through2({ objectMode: true }, function (chunk, enc, callback) {
    this.push({
        name    : chunk[0]
      , address : chunk[3]
      , phone   : chunk[10]
    })
    callback()
  }))
  .on('data', console.log)
```

## API

<b><code>csv2([ options ])</code></b>

The optional `options` object is passed through to the `stream.Through` class. You can supply a `'separator'` option to change the default separator from `','` to whatever your data is using.

## License

**csv2** is Copyright (c) 2013 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.