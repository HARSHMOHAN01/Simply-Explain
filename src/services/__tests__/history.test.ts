import { describe, it, expect } from 'vitest';
import { generateId } from '../history';

describe('history service', () => {
  describe('generateId', () => {
    it('generates a string of reasonable length', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(10);
    });

    it('generates unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });
});
