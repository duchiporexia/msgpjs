import { UIntID } from '../';

export interface Foo {
  id: UIntID;
  name: string;
  age: number;
  map: { [key: string]: string };
  map2: { [key: string]: Dog };
  arr: string[];
  arr2: Dog[];
  dog: Dog;
  dog2: Dog | null;
  createTime: Date;
  updateTime: Date | null;
}

export interface Dog {
  name: string;
  age: number;
}

export const foo: Foo = {
  id: UIntID.from('9223372036854775807'),
  name: 'Hello, world!',
  age: 18,
  map: { k1: 'v1' },
  map2: {
    d1: {
      name: 'dog1',
      age: 3,
    },
  },
  arr: ['i1', 'i3'],
  arr2: [
    {
      name: 'dog1',
      age: 3,
    },
    {
      name: 'd2',
      age: 1000,
    },
  ],
  dog: {
    name: 'dog1',
    age: 3,
  },
  dog2: {
    name: 'd2',
    age: 1000,
  },
  createTime: new Date('2020-01-01'),
  updateTime: null,
};
