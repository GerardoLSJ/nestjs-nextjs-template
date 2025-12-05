import { sharedTypes } from './shared-types';

describe('sharedTypes', () => {
  it('should return the expected string', () => {
    expect(sharedTypes()).toBe('shared-types');
  });
});
