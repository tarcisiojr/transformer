/* eslint-disable no-undef */
const assert = require('assert');

const lib = require('../src');

describe('Testing getValue', () => {
  it('Testing testing simple gets', () => {
    const value = {
      a: 'a',
      b: { c: 'c'},
      d: null,
      e: {f: {g: 'g'}}
    };

    assert.strictEqual(lib.getValue('a', value), 'a');
    assert.deepStrictEqual(lib.getValue('b', value), {c: 'c'});
    assert.strictEqual(lib.getValue('b.c', value), 'c');
    assert.strictEqual(lib.getValue('e.f.g', value), 'g');
    assert.strictEqual(lib.getValue('e.f.g.w', value), null);
    assert.strictEqual(lib.getValue('w', value), null);
  });

  it('Testing parent gets', () => {
    const value = {
      a: 'a',
      b: { c: 'c'},
      d: null,
      e: {f: {g: 'g'}}
    };

    assert.deepStrictEqual(lib.getValue('b.c.$parent', value), {c: 'c'});
  });
});

describe('Testing transform', () => {
  it('Testing transform object', () => {
    const value = {
      a: 'a',
      b: { c: 'c'},
      d: null,
      e: {f: {g: 'g'}}
    };

    const schema = {
      valueA: 'a',
      valueG: 'e.f.g',
      nestedF: {
        nestedB: 'b',
        nestedC: 'b.c'
      }
    };

    const expected = {
      valueA: 'a',
      valueG: 'g',
      nestedF: {
        nestedB: {c: 'c'},
        nestedC: 'c'
      }
    };

    const ret = lib.transform(schema)(value);

    assert.deepStrictEqual(ret, expected);
  });

  it('Testing transform array of object', () => {
    const value = [{
      a: 'a',
      b: { c: 'c'},
      d: null,
      e: {f: {g: 'g'}}
    }, {
      a: 'second-a',
      b: { c: 'second-c'},
      d: null,
      e: {f: {g: 'second-g'}}
    }];

    const schema = {
      valueA: 'a',
      valueG: 'e.f.g',
      nestedF: {
        nestedB: 'b',
        nestedC: 'b.c'
      }
    };

    const expected = [{
      valueA: 'a',
      valueG: 'g',
      nestedF: {
        nestedB: {c: 'c'},
        nestedC: 'c'
      }
    }, {
      valueA: 'second-a',
      valueG: 'second-g',
      nestedF: {
        nestedB: {c: 'second-c'},
        nestedC: 'second-c'
      }
    }];

    const ret = lib.transform(schema)(value);

    assert.deepStrictEqual(ret, expected);
  });

  it('Testing denormalization', () => {
    const value = {
      key1: 'valueOfKey1',
      key2: {
        key3: 'valueOfKey3'
      },
      children: [{
        childKey1: 'valueOfChildKey1',
        childKey2: 'valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'valueNestedChild4'
        }
      }, {
        childKey1: 'second-valueOfChildKey1',
        childKey2: 'second-valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'second-valueNestedChild4'
        }
      }, {
        childKey1: 'third-valueOfChildKey1',
        childKey2: 'third-valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'third-valueNestedChild4'
        }
      }]
    };

    const schema = [
      'children',
      {
        childKey1: 'children.childKey1',
        nestedChild4: 'children.nestedChild3.nestedChild4',
        key1: 'key1',
        key3: 'key2.key3'
      }
    ];

    const expected = [{
      childKey1: 'valueOfChildKey1',
      nestedChild4: 'valueNestedChild4',
      key1: 'valueOfKey1',
      key3: 'valueOfKey3'
    }, {
      childKey1: 'second-valueOfChildKey1',
      nestedChild4: 'second-valueNestedChild4',
      key1: 'valueOfKey1',
      key3: 'valueOfKey3'
    }, {
      childKey1: 'third-valueOfChildKey1',
      nestedChild4: 'third-valueNestedChild4',
      key1: 'valueOfKey1',
      key3: 'valueOfKey3'
    }];

    const ret = lib.transform(schema)(value);

    assert.deepStrictEqual(ret, expected);
  });

  it('Testing denormalization (array of array)', () => {
    const value = [{
      key1: 'valueOfKey1',
      key2: {
        key3: 'valueOfKey3'
      },
      children: [{
        childKey1: 'valueOfChildKey1',
        childKey2: 'valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'valueNestedChild4'
        }
      }]
    }, {
      key1: 'second-valueOfKey1',
      key2: {
        key3: 'second-valueOfKey3'
      },
      children: [{
        childKey1: 'second-valueOfChildKey1',
        childKey2: 'second-valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'second-valueNestedChild4'
        }
      }, {
        childKey1: 'third-valueOfChildKey1',
        childKey2: 'third-valueOfChildKey2',
        nestedChild3: {
          nestedChild4: 'third-valueNestedChild4'
        }
      }]
    }];

    const schema = [
      'children',
      {
        childKey1: 'children.childKey1',
        nestedChild4: 'children.nestedChild3.nestedChild4',
        key1: 'key1',
        key3: 'key2.key3'
      }
    ];

    const expected = [{
      childKey1: 'valueOfChildKey1',
      nestedChild4: 'valueNestedChild4',
      key1: 'valueOfKey1',
      key3: 'valueOfKey3'
    }, {
      childKey1: 'second-valueOfChildKey1',
      nestedChild4: 'second-valueNestedChild4',
      key1: 'second-valueOfKey1',
      key3: 'second-valueOfKey3'
    }, {
      childKey1: 'third-valueOfChildKey1',
      nestedChild4: 'third-valueNestedChild4',
      key1: 'second-valueOfKey1',
      key3: 'second-valueOfKey3'
    }];

    const ret = lib.transform(schema)(value);

    assert.deepStrictEqual(ret, expected);
  });
});
