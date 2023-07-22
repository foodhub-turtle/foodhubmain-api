module.exports = {
    secret: "bezkoder-secret-key",
    jwtExpiration: 86400,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
  
    /* for test */
    // jwtExpiration: 3000,          // 1 minute
    // jwtRefreshExpiration: 6000,  // 2 minutes
};