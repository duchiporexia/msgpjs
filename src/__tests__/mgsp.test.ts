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
  deepStrictEqual(newFoo.age, 198);
  newFoo.age = 18;
  deepStrictEqual(newFoo, foo);
  expect(newFoo.id.str).toEqual(foo.id.str);
  expect(newFoo.createTime.getTime()).toEqual(foo.createTime.getTime());
}, 9999999);
