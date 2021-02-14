import { deepStrictEqual } from 'assert';
import axios from 'axios';
import { msgDecode, msgEncode, UIntID } from '../';
import { foo, Foo } from './Foo';

test('msgp test', () => {
  const object = {
    nil: null,
    integer: 1,
    uintID: UIntID.from('9223372036854775807'),
    float: Math.PI,
    string: 'Hello, world!',
    binary: Uint8Array.from([1, 2, 3]),
    array: [10, 20, 30],
    map: { foo: 'bar' },
    timestampExt: new Date(),
    updateTime: null,
  };

  const encoded: Uint8Array = msgEncode(object);

  const decoded = msgDecode(encoded);
  deepStrictEqual(decoded, object);
});

test('msgp api test', async () => {
  axios.defaults.adapter = require('axios/lib/adapters/http');

  const encoded: Uint8Array = msgEncode(foo);

  const ret = (await axios.post('http://localhost:3030/foo/180', Uint8Array.from(encoded), {
    responseType: 'arraybuffer',
  })) as any;
  const newFoo = msgDecode(ret.data) as Foo;
  expect(newFoo.id.toString()).toEqual(foo.id.toString());
  expect(newFoo.name).toEqual(foo.name);
  expect(newFoo.age).toEqual(foo.age + 180);
  deepStrictEqual(newFoo.map, foo.map);
  deepStrictEqual(newFoo.map2, foo.map2);
  deepStrictEqual(newFoo.arr, foo.arr);
  deepStrictEqual(newFoo.arr2, foo.arr2);
  deepStrictEqual(newFoo.dog, foo.dog);
  deepStrictEqual(newFoo.dog2, foo.dog2);
  expect(newFoo.createTime.getTime()).toEqual(foo.createTime.getTime());
  expect(newFoo.updateTime).toEqual(null);
}, 9999999);
