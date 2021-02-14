import Long from 'long';
import { decode, encode, EXT_TIMESTAMP, ExtensionCodec } from '@msgpack/msgpack';

export class UIntID {
  private readonly _id: string;
  private constructor(id: string) {
    this._id = id;
  }
  static from(id: string) {
    return new UIntID(id);
  }
  toString() {
    return this._id;
  }
  get str() {
    return this._id;
  }
}

function UIntIDToBytes(id: UIntID) {
  return new Uint8Array(Long.fromString(<string>id.toString()).toBytesLE());
}

function UIntIDFromBytes(data: Uint8Array) {
  return UIntID.from(Long.fromBytesLE(data as any, false).toString(10));
}

const UIntID_EXT_TYPE = 60; // Any in 0-127
const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: UIntID_EXT_TYPE,
  encode: (input: unknown) => {
    if (input instanceof UIntID) {
      return UIntIDToBytes(input);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    return UIntIDFromBytes(data);
  },
});

// Date type
extensionCodec.register({
  type: EXT_TIMESTAMP,
  encode: (input: unknown) => {
    if (input instanceof Date) {
      const time = input.getTime();
      const secs = Math.floor(time / 1000);
      const seconds = Long.fromNumber(secs);
      const nanoSeconds = Long.fromNumber((time - secs * 1000) * 1000000);
      return new Uint8Array([...seconds.toBytesLE(), ...nanoSeconds.toBytesLE()]);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const secs = data.slice(0, 8);
    const milliSecs = data.slice(8, 12);
    const seconds = Long.fromBytesLE(secs as any, false).toNumber();
    const nanoSeconds = Long.fromBytesLE(milliSecs as any, false).toNumber();
    const milliSeconds = Math.floor(nanoSeconds / 1000000 + seconds * 1000);
    return new Date(milliSeconds);
  },
});

export function msgEncode(object: any) {
  return encode(object, { extensionCodec });
}

export function msgDecode(data: Uint8Array) {
  return decode(data, { extensionCodec });
}
