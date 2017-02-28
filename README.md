[![Build Status](https://travis-ci.org/genomejs/gql.png?branch=master)](https://travis-ci.org/genomejs/gql)

[![NPM version](https://badge.fury.io/js/gql.png)](http://badge.fury.io/js/gql)

## Information

<table>
<tr>
<td>Package</td><td>gql</td>
</tr>
<tr>
<td>Description</td>
<td>Query language for interpreting genome SNPs</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.4</td>
</tr>
</table>

## Compatibility

This query language is for use with the genomejs JSON format. See the [dna2json](https://github.com/genomejs/dna2json) repository for more information.

Just a reminder: deletions are represented as `-`!

## Usage

This example will create a query that determines if a person is sickle cell effected.

```javascript
var gql = require('gql');
var dna = require('./genome.json');

var query = gql.or([
  gql.exact('rs334', 'TT'),
  gql.exact('i3003137', 'AA')
]);

var isMatch = query(dna);
console.log(isMatch); // true or false
```


## API

All of these APIs return a boolean-returning function that acts as the truth test. These functions take in one argument, a DNA-JSON object. You can nest as deep as you want, or be as basic as you want.

For example, checking if a person is immune to norovirus is pretty simple:

```js
var dna = require('./my-dna.json');

var query = gql.exact('rs601338', 'AA');
var isImmune = query(dna);
```

### Conditions

#### exact(id, genotype)

Evaluates to true if this was the only allele observed.

```javascript
q.exact('rs2032651', 'D'); // will only match genotype D
q.exact('rs2032651', 'AT'); // will only match genotype AT
```

#### has(id, genotype)

Evaluates to true if the allele was observed at all.

```javascript
q.has('rs2032651', 'A'); // will match GA, GAT, AB, etc.
```

#### exists(id)

Evaluates to true if any allele has been observed.

```javascript
q.exists('rs2032651');
```

#### doesntExist(id)

Evaluates to true if no allele has been observed.

```javascript
q.doesntExist('rs2032651');
```

#### not(condition)

Inverts the result of another condition.

```javascript
// evaluates to true if rs2032651 != AA
var query = q.not(q.exact('rs2032651', 'AA'));

query({
  rs2032651: {
    genotype: 'TT'
  }
}); // true

query({
  rs2032651: {
    genotype: 'AA'
  }
}); // false
```

#### only(id, allele)

Evaluates to true if only the allele was observed at the specified position.

```javascript
q.only('rs2032651', 'A'); // will match A, AA, AAA, etc.
```

### Aggregate Conditions

#### or(conditions...)

Evaluates to true if any of the given condition functions evaluate to true.

```javascript
q.or([
  q.has('rs2032651', 'A'),
  q.doesntExist('rs2032651')
]);
```

#### and(conditions...)

Evaluates to true if all of the given condition functions evaluate to true.

```javascript
q.and([
  q.exists('rs2032652'),
  q.has('rs2032651', 'A')
]);
```

#### atLeast(number, conditions...)

Evaluates to true if the number of given condition functions evaluating to true is equal to or greater than the given number.

```javascript
q.atLeast(2, [
  q.exists('rs2032652'),
  q.has('rs2032651', 'A'),
  q.exact('rs2032653', 'AT'),
  q.exact('rs2032654', 'GG')
]);
```

#### none(conditions...)

Evaluates to true if all of the given condition functions evaluate to false.

```javascript
q.none([
  q.has('rs2032651', 'A'),
  q.doesntExist('rs2032651')
]);
```

## LICENSE

(MIT License)

Copyright (c) 2013 Fractal <contact@wearefractal.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
