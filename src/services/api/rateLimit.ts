export const rateLimitHandler = {
  remaining: 1000,
  reset: 0,

  updateFromHeaders(headers: Record<string, string>) {
    this.remaining = parseInt(headers['ratelimit-remaining'] || '1000');
    this.reset = parseInt(headers['ratelimit-reset'] || '0');
  },

  canMakeRequest() {
    return this.remaining > 0;
  },

  getResetTime() {
    return new Date(Date.now() + this.reset * 1000).toLocaleTimeString();
  }
};
