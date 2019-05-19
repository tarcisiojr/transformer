# TRANSFORMER
A simple JavaScript lib to transform objects and arrays.

# Usage

## Init

```javascript
const {transform} = require('transformer');

```

## Converting simple object

```javascript
const value = {
    key1: 'value1'
    key2: {
        key3: 'value3'
    }
}

const schema = {
    newKey1: 'key1',
    newKey3: 'key2.key3' // dot notation
}

console.log(transfom(schema)(value));

// Outpout
{
    newKey1: 'value1',
    newKey3: 'value3'
}
```

## Converting object to flat array of objects

```javascript
const value = [{
    key1: 'value1'
    arr: [{
        keyChild1: 'valueChild1'
    }, {
        keyChild1: 'valueChild2'
    }]
}, {
    key1: 'value2'
    arr: [{
        keyChild1: 'v2-valueChild1'
    }]
}]

const schema = [
    'arr' // array of object,
    { // schema
        newKey: 'key1',
        newChildKey1: 'arr.keyChild1'
    }
]

console.log(transfom(schema)(value));

// Outpout
[{
    newKey: 'value1',
    newChildKey1: 'valueChild1'
}, {
    newKey: 'value1',
    newChildKey1: 'valueChild2'
}, {
    newKey: 'value2',
    newChildKey1: 'v2-valueChild2'
}]
```