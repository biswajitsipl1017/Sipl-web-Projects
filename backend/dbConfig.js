const dbConfig = {
    user: 'erp',
    password: 'ERP#SFactor',
    server: '45.127.101.16',
    port: '',
    database: 'AppConfig',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
  
  module.exports = { dbConfig };
  