module.exports = {
  apps: [
    {
      name: 'interview',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'development',
        TEN_BIEN: 'Gia tri'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
