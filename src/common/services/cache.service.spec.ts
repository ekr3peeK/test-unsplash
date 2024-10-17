import { addSeconds } from 'date-fns';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should remove expired cache entries after the TTL has passed', () => {
    const cache = new CacheService<string>();
    const now = new Date();

    cache.set('key1', 'value1', 1);
    cache.set('key2', 'value2', 2);

    expect(cache.size()).toBe(2);
    
    jest.setSystemTime(addSeconds(now, 1));
    jest.advanceTimersByTime(1000 * 65);

    expect(cache.size()).toBe(1);
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('value2');

    jest.advanceTimersByTime(1000 * 60);

    expect(cache.size()).toBe(0);
    expect(cache.get('key2')).toBeUndefined();
  });

  it('should return undefined when no key is found', () => {
    const cache = new CacheService<string>();
    cache.set('existing', 'Exists');

    expect(cache.get('inexistent')).toBeUndefined();
    expect(cache.get('existing')).toBe('Exists');
  });

  it('should be able to clear all the cache', () => {
    const cache = new CacheService<string>();
    cache.set('key1', '1');
    cache.set('key2', '2');
    cache.set('key3', '3');

    expect(cache.size()).toBe(3);
    cache.clear();

    expect(cache.size()).toBe(0);
  });

  it('should be able to overwrite keys', () => {
    const cache = new CacheService<string>();
    cache.set('key1', 'original');
    expect(cache.get('key1')).toBe('original');
    
    cache.set('key1', 'overwritten');
    expect(cache.get('key1')).toBe('overwritten');
  });
});