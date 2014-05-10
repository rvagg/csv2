const test = require('tape')
    , csv2 = require('./')

function csvify (data, sep) {
  return data.map(function (line) {
    return line.join(sep || ',')
  }).join('\n')
}

function simpleTest (sep, t) {
  t.plan(1)

  var data = [
          [ '1', '2', '3', '4', '5', 'foo'  ]
        , [ '6', '7', '8', '9', '10', 'bar' ]
        , [ 'wut?' ]
        , [ '" a string "', '",string,with,commas"', '"a string with "" escaped "" quotes"']
      ]
    , line4  = [ ' a string ', ',string,with,commas', 'a string with " escaped " quotes']

    , result = []
    , stream = csv2(sep != ',' ? { separator: sep } : undefined)


  stream.on('data', function (d) {
    result.push(d)
  })
  stream.on('end', function () {
    data[3] = line4
    t.deepEqual(result, data, 'got correct data')
  })

  stream.end(csvify(data, sep))
}

test('simplistic csv data', simpleTest.bind(null, ','))

test('simplistic csv data with "|" separator', simpleTest.bind(null, '|'))

test('simplistic csv data, split into chunks', function (t) {
  t.plan(1)

  var data = [
          [ '1', '2', '3', '4', '5', 'foo'  ]
        , [ '6', '7', '8', '9', '10', 'bar' ]
        , [ 'wut?' ]
        , [ '" a string "', '",string,with,commas"', '"a string with "" escaped "" quotes"']
      ]
    , line4  = [ ' a string ', ',string,with,commas', 'a string with " escaped " quotes']
    , mult   = 10000

    , result = []
    , stream = csv2()
    , i

  // expand it so that it's big enough that splitting it up in to
  // random small chunks is more likely to find edge cases
  for (i = 0; i < mult; i++)
    data.push(Array.prototype.slice.apply(data[i]))

  stream.on('data', function (d) {
    result.push(d)
  })
  stream.on('end', function () {
    for (i = 3; i < data.length; i += 4)
      data[i] = line4
    t.deepEqual(result, data, 'got correct data')
  })

  var outdata = csvify(data)
    , e

  i = 0

  while (i < outdata.length) {
    e = i + Math.ceil(Math.random() * 10)
    stream.write(new Buffer(outdata.substring(i, e), 'utf8'))
    i = e
  }
  stream.end()
})
