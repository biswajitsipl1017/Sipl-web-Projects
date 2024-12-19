// dbUtils.js
const sql = require('mssql');
const { dbConfig } = require('./dbConfig');

// Use a mutable object for globalDbConfig
const globalDbConfig = { ...dbConfig };

async function updateGlobalDbConfig(clientId) {
  try {
    // Connect to the base database
    const pool = await sql.connect(dbConfig);

    // Query to get the target database config
    const result = await pool
      .request()
      .input('CompCode', sql.VarChar, clientId)
      .query(`SELECT ServerIP, DBName, DBUser, DBPassword, '' DBPort FROM AppDB WHERE CompCode = @CompCode`);

    if (result.recordset.length === 0) {
      throw new Error('Invalid ClientID: No matching configuration found.');
    }

    const { ServerIP, DBName, DBUser, DBPassword, DPPort } = result.recordset[0];

    // Update the properties of globalDbConfig
    globalDbConfig.user = DBUser;
    globalDbConfig.password = DBPassword;
    globalDbConfig.server = ServerIP;
    globalDbConfig.database = DBName;
    globalDbConfig.port = DPPort || 7070
    // console.log('Global DB Configuration Updated at dbUtils:', globalDbConfig);

    await pool.close();
  } catch (error) {
    console.error('Error updating global DB config:', error.message);
    throw error;
  }
}

module.exports = { updateGlobalDbConfig, globalDbConfig };
