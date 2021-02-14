import { MSGP_VERSION } from '../index';
test('version test', async () => {
    expect(MSGP_VERSION).toEqual(10);
});
