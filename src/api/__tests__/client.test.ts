import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../client';

describe('apiClient', () => {
  beforeEach(() => {
    // Clear localStorage and fetch mocks before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should handle successful requests', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers()
    });

    const result = await apiClient('/test');
    expect(result).toEqual(mockData.data);
  });

  it('should handle ETags and return cached data', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    const etag = '"123"';
    
    // First request - returns data with ETag
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ 'ETag': etag })
    });

    await apiClient('/test');

    // Second request - returns 304 Not Modified
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 304,
      headers: new Headers()
    });

    const result = await apiClient('/test');
    expect(result).toEqual(mockData.data);
  });

  it('should handle rate limiting with retry', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    
    // First attempt - rate limited
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        status: 429,
        headers: new Headers({ 'Retry-After': '1' })
      })
      // Second attempt - successful
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
        headers: new Headers()
      });

    const result = await apiClient('/test');
    expect(result).toEqual(mockData.data);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after max retries', async () => {
    // All attempts rate limited
    global.fetch = vi.fn().mockResolvedValue({
      status: 429,
      headers: new Headers({ 'Retry-After': '1' })
    });

    await expect(apiClient('/test', { maxRetries: 2 }))
      .rejects
      .toThrow('Rate limit exceeded');
  });

  it('should skip cache when requested', async () => {
    const mockData = { data: { id: 1, name: 'Test' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
      headers: new Headers({ 'ETag': '"123"' })
    });

    await apiClient('/test', { skipCache: true });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({
        headers: expect.objectContaining({
          'If-None-Match': expect.any(String)
        })
      })
    );
  });
});
