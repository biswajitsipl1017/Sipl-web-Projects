const express = require('express');
const path = require('path');
const cors = require('cors');
const sql = require('mssql');
const bodyParser = require('body-parser')
const { updateGlobalDbConfig, globalDbConfig } = require('./dbUtils');
// const { dbConfig } = require('./dbConfig');

const app = express();

app.use(bodyParser.json());

// Middleware
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

// Handle React routing by returning the index.html file
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database configration
// const dbConfig = {
//   user: 'erp',
//   password: 'ERP#SFactor',
//   server: '3.109.237.102',
//   port: 7070,
//   database: 'S_Factor_RCWPL_20240920',
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
//   pool: {
//     max: 10,
//     min: 0,
//     idleTimeoutMillis: 30000,
//   },
// };

// Routes

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

// Function to connect to the database
async function testConnection() {
  try {
    sql.connect(globalDbConfig);
    // console.log('Global DB Configuration Updated at Index.js:,', globalDbConfig);
    console.log('Global DB Configuration Updated.');
  } catch (err) {
    console.error('Global DB Configuration Database connection failed.', err);
  }
}
// testConnection();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http:localhost:${PORT}`);
});

// const pool = new sql.ConnectionPool(globalDbConfig);

// Helper function to get a connection pool dynamically
async function getDbPool() {
  const pool = new sql.ConnectionPool(globalDbConfig);
  return pool.connect();
}

// API endpoint for user Login
app.post('/login', async (req, res) => {
  const { clientid, email, password } = req.body;

  try {

    // Validate email/password (you can replace this with actual logic)
    if (!clientid || !email || !password) {
      return res.status(400).send({ error: 'All fields are required.' });
    }

    await updateGlobalDbConfig(clientid);
    // connection to the database starts
    // call testConnection to test the dynamic database connection
    testConnection();
    // const poolConnection = await pool.connect(); 
    const poolConnection = await getDbPool();

    const result = await poolConnection.request()
      .input('Email', sql.VarChar, email)
      .input('Password', sql.VarChar, password)
      .execute('[SP_Get_UserLogin]');

    if (result.recordset.length > 0) {
      const response = result.recordset[0];
      res.json({
        respCode: response.RespCode,
        respMessage: response.RespMessage,
        userID: response.UserID,
        userName: response.UserName,
        userLevel: response.UserLevel,
        userGrp: response.UserGrp,
        superUser: response.SuperUser,
        mobile: response.Mobile,
        emailID: response.EmailID,
        spCode: response.SPCode,
        compCode: response.CompCode,
        compName: response.CompName,
        location: '',
      });
    } else {
      res.status(401).json({ respCode: 401, respMessage: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('SQL execution error:', err);
    res.status(500).json({ respCode: 500, respMessage: 'Internal server error' });
  }
});


// API endpoint for Menu Data
app.post('/menu', async (req, res) => {
  const { UserType } = req.query;
  try {
    // await sql.connect(dbConfig);

    const poolConnection = await getDbPool();
    const result = await poolConnection.query`EXEC [SP_Get_UserMenu] ${UserType}`;
    const menuData = result.recordset; // Extract menu data from the query result
    res.status(200).json(menuData); // Return the menu data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await sql.close();
  }
});

// Get Company wise location for Select Location page
app.post('/api/getCompanyLoc', async (req, res) => {
  const company = req.query.company;
  try {
    // const poolConnection = await pool.connect();
    const poolConnection = await getDbPool();
    const result = await poolConnection
      .request()
      .query(`Select CompCode, CompName, Location From ADM1 Where CompCode='${company}'`);

    const locations = result.recordset
    // console.log(locations);

    if (locations && locations.length > 0) {
      res.json(locations)
    } else {
      res.status(404).json({ message: 'No locations found' });
    }
  }
  catch (err) {
    console.log('SQL execution error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
})

// Get Currency For Customer Page
app.post('/api/getCurrencies', async (req, res) => {
  try {
    // const poolConnection = await pool.connect();
    const poolConnection = await getDbPool();
    const result = await poolConnection.request().query('SELECT CurrencyName FROM OCRN ORDER BY SLNo');

    const currencies = result.recordset;

    if (currencies && currencies.length > 0) {
      res.json(currencies);
    } else {
      res.status(404).json({ message: 'No currencies found' });
    }
  } catch (err) {
    console.error('SQL execution error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Countries to bind dropdown at Customer Page
app.post('/api/getCountries', async (req, res) => {
  try {
    // const poolConnection = await pool.connect();
    const poolConnection = await getDbPool();
    const result = await poolConnection.request().query('Select Country as CountryName From State Group By Country order by Country');

    const countries = result.recordset;

    if (countries && countries.length > 0) {
      res.json(countries);
    } else {
      res.status(404).json({ message: 'No Countries found' });
    }
  } catch (err) {
    console.error('SQL execution error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Countries to bind dropdown at Customer Page
app.post('/api/getStates', async (req, res) => {
  try {
    // const poolConnection = await pool.connect();
    const poolConnection = await getDbPool();

    const country = req.query.country; // Read country from query string
    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }

    const result = await poolConnection
      .request()
      .query(`SELECT State AS StateName FROM State WHERE Country = '${country}' ORDER BY State`);

    const states = result.recordset;

    if (states && states.length > 0) {
      res.json(states); // Send the fetched states
    } else {
      res.status(404).json({ message: 'No states found' });
    }
  } catch (err) {
    console.error('SQL execution error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Tblf5 Call for Dropdown table
// app.post('/api/getTblf5Data', async (req, res) => {
//   try {
//       const { formName, fieldName } = req.body;

//       const poolConnection = await pool.connect();
//       const queryResult = await poolConnection
//           .request()
//           .query(`SELECT Query FROM TBLF5 WHERE FormName='${formName}' AND FieldName='${fieldName}'`);

//       if (!queryResult.recordset.length) {
//           return res.status(404).json({ message: 'Query not found' });
//       }

//       const tableQuery = queryResult.recordset[0].Query;
//       console.log(tableQuery);
//       const dataResult = await poolConnection.request().query(tableQuery);

//       res.json(dataResult.recordset);
//   } catch (err) {
//       console.error('Error executing query:', err);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Tblf5 Call for Dropdown table with dynamic filtering
app.post('/api/getTblf5Data', async (req, res) => {
  try {
    const { formName, fieldName, fieldValue } = req.body;

    // console.log(formName, fieldName, fieldValue);

    // Ensure the necessary fields are provided
    if (!formName || !fieldName) {
      return res.status(400).json({ message: 'formName and fieldName are required' });
    }

    // console.log(formName, fieldName);

    // const poolConnection = await pool.connect();
    const poolConnection = await getDbPool();

    // Fetch the query template from the database
    const queryResult = await poolConnection
      .request()
      .query(`SELECT Query FROM TBLF5 WHERE FormName='${formName}' AND FieldName='${fieldName}'`);

    if (!queryResult.recordset.length) {
      return res.status(404).json({ message: 'Query not found' });
    }

    let tableQuery = queryResult.recordset[0].Query;
    // console.log(tableQuery);
    // If there's a fieldValue, replace the placeholder with the actual value
    // console.log(formName, `#${fieldName.toUpperCase()}`, fieldValue || null);
    if (fieldValue) {
      // console.log(formName, fieldName, fieldValue || null);
      // console.log(tableQuery);
      // const placeholder = `#${fieldName.toUpperCase()}`; // Creates a placeholder like #BPGroup1
      // tableQuery = tableQuery.replace(placeholder, fieldValue); // Replace with fieldValue
      if (fieldName == 'BPGroup2') {
        const placeholder = `#BPGROUP1`; // Creates a placeholder like #BPGroup1
        tableQuery = tableQuery.replace(placeholder, fieldValue); // Replace with fieldValue
        // console.log(`After replacing query: ${tableQuery}`);
      }
      else if (fieldName == 'BPGroup3') {
        const placeholder = `#BPGROUP2`; // Creates a placeholder like #BPGroup1
        tableQuery = tableQuery.replace(placeholder, fieldValue); // Replace with fieldValue
        // console.log(`After replacing query: ${tableQuery}`);
      }
    }

    // console.log(fieldName, tableQuery);

    // Execute the modified query
    const dataResult = await poolConnection.request().query(tableQuery);
    // if(fieldName == 'BPParentName'){
    //   console.log(dataResult);
    // }
    // console.log(dataResult);

    // Return the filtered data
    res.json(dataResult.recordset);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//  -------------------------- DropDownTable From TBLF5 ----------------
app.post('/api/getTableData', async (req, res) => {
  const { formName, fieldName, fieldValue } = req.body;
  // console.log(formName, fieldName, fieldValue);

  try {
    if (!formName || !fieldName) {
      return res.status(400).json({ message: 'formName and fieldName are required' });
    }
    const poolConnection = await getDbPool();

    const queryResult = await poolConnection
      .request()
      .query(`SELECT Query FROM TBLF5 WHERE FormName='${formName}' AND FieldName='${fieldName}'`);

    if (!queryResult.recordset.length) {
      return res.status(404).json({ message: 'Query not found' });
    }

    let tableQuery = queryResult.recordset[0].Query;
    if (fieldName) {
      if (fieldName == 'TxtCompCode') {
        tableQuery = tableQuery + ` Where T1.UserID='Admin'`;
      }
    }
    // console.log(tableQuery);

    const dataResult = await poolConnection.request().query(tableQuery);
    res.json(dataResult.recordset);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// End point for Genenerating Table structire from GRDS
app.post('/api/grdsTable', async (req, res) => {
  const { formName, grdName } = req.body;

  const query = `
    SELECT ColIndex, ColHdName, Tbl_Col_Name, ColHdText, Visible, ReadOnly,
     ColType, TextAlignment, ColResizable, cast(ColWidth as nvarchar(20))+'px' ColWidth
    FROM GRDS
    WHERE FormName=@formName AND GrdName=@grdName
    ORDER BY ColIndex
  `;

  try {
    // Get a connection pool
    const pool = await getDbPool();

    // Execute the query using parameterized inputs to prevent SQL injection
    const result = await pool
      .request()
      .input('formName', formName)
      .input('grdName', grdName)
      .query(query);

    // Return the rows from the query result
    res.json(result.recordset); // `recordset` contains the rows
  } catch (error) {
    console.error('Error fetching column data:', error);
    res.status(500).send('Internal Server Error');
  }
});


// POST route to handle form submission
app.post("/api/customersODetail", async (req, res) => {
  try {
    const customer = req.body;
    const userID = req.headers.userid;
    const actionType = req.headers.actiontype;
    const pcName = req.hostname;
    // console.log(userID);

    // console.log(req.headers);
    // console.log(userID);
    // console.log(actionType);

    // Connect to the database
    // const pool = await sql.connect(dbConfig);
    const poolConnection = await getDbPool();

    // Execute stored procedure
    const result = await poolConnection.request()
      .input("ActionType", sql.NVarChar(20), actionType)
      .input("BPCode", sql.NVarChar(10), customer.bpCode)
      .input("BPName", sql.NVarChar(200), customer.bpName)
      .input("BPDisplayName", sql.NVarChar(200), customer.bpDisplayName)
      .input("BPShortName", sql.NVarChar(200), customer.bpShortName)
      .input("Proprietor", sql.NVarChar(50), customer.proprietor)
      .input("UnitOfGroup", sql.NVarChar(50), customer.unitOfGroup)
      .input("ParentBPCode", sql.NVarChar(10), customer.parentBPCode)
      .input("ParentBPName", sql.NVarChar(200), customer.parentBPName)
      .input("BPGroup1", sql.NVarChar(40), customer.BPGroup1)
      .input("BPGroup2", sql.NVarChar(40), customer.BPGroup2)
      .input("BPGroup3", sql.NVarChar(40), customer.BPGroup3)
      .input("VAT", sql.NVarChar(60), customer.vat)
      .input("CST", sql.NVarChar(60), customer.cst)
      .input("PAN", sql.NVarChar(20), customer.pan)
      .input("TMCO", sql.NVarChar(20), customer.tmco)
      .input("ESI", sql.NVarChar(20), customer.esi)
      .input("BPCurrency", sql.NVarChar(10), customer.bpCurrency)
      .input("ECCNo", sql.NVarChar(30), customer.eccNo)
      .input("CEReg", sql.NVarChar(30), customer.ceRegistrationNo)
      .input("CERange", sql.NVarChar(30), customer.ceRange)
      .input("CEComm", sql.NVarChar(30), customer.ceCommissionorate)
      .input("ServiceTax", sql.NVarChar(30), customer.serviceTaxNo)
      .input("DCRegNo", sql.NVarChar(30), customer.dcRegNo)
      .input("BioCardNo", sql.NVarChar(50), customer.bioCardNo)
      .input("MSMECat", sql.NVarChar(15), customer.msmeCategory)
      .input("MSMERegNo", sql.NVarChar(50), customer.msmeRegNo)
      .input("MSMERegDate", sql.Date, customer.msmeRegDate)
      .input("MSMEValid", sql.Date, customer.msmeValidUpto)
      .input("PaymentMode", sql.NVarChar(30), customer.paymentMode)
      .input("PaymentTerm", sql.Numeric(18, 0), customer.paymentTerm)
      .input("CreditLimit", sql.Numeric(18, 0), customer.creditLimit)
      .input("GLCess", sql.NVarChar(1), customer.glCess)
      .input("ASSTGA", sql.NVarChar(1), customer.aastga)
      .input("Active", sql.NVarChar(1), customer.active)
      .input("Approved", sql.NVarChar(1), customer.approved)
      .input("UserID", sql.NVarChar(50), userID)
      .input("PCName", sql.NVarChar(50), pcName)
      .execute("SP_Insert_Customer_Data");

    // Close the database connection
    poolConnection.close();

    if (result.recordset && result.recordset.length > 0) {
      res.status(200).json({
        message: result.recordset[0].RespMessage,
        messageID: result.recordset[0].RespCode
      });
    }

    //res.status(200).json({ message: "Data inserted successfully", result });
  } catch (error) {
    console.error("Error inserting data", error);
    res.status(500).json({ message: "Failed to insert data", error });
  }
});


// Helper function to generate address query
function generateAddressQuery(bpCode, addresses) {
  const addressQuery = addresses
    .map(addr => {
      return `SELECT '${bpCode}' AS BPCode, '${addr.location}' AS Location, ${addr.lineID} AS LineID, 
              '${addr.address1}' AS Add1, '${addr.address2}' AS Add2, '${addr.address3}' AS Add3, 
              '${addr.city}' AS City, '${addr.state}' AS State, '${addr.country}' AS Country, 
              '${addr.zip}' AS PIN, '' AS ContactPerson, 
              '${addr.phone1}' AS Phone1, '${addr.phone2}' AS Phone2, '${addr.mobile}' AS Mobile, 
              '${addr.fax}' AS Fax, '${addr.email}' AS Email, '${addr.website}' AS WebSite, 
              '${addr.tanNum}' AS TANNo, '${addr.gstSelect}' AS GSTType, '${addr.gstNum}' AS GSTIN, 
              '${addr.sezChecked}' AS SEZ, '${addr.compositGstChecked}' AS CompositGST, 
              '${addr.activeChecked}' AS ActiveRow, '${addr.addressApprChecked}' AS ApprovedRow`;
    })
    .join(" UNION ALL ");
  return addressQuery;
}

// Helper function to generate Account query
function generateAccountQuery(bpCode, accounts) {
  const accountQuery = accounts
    .map(acc => {
      return `SELECT '${bpCode}' AS BPCode, ${acc.lineID} AS LineID, '${acc.glCode}' AS GLCode, 
              '${acc.glName}' AS GLName, '${acc.mGroup1}' MGroup1, '${acc.mGroup2}' MGroup2, '${acc.mGroup3}' MGroup3`;
    })
    .join(" UNION ALL ");
  return accountQuery;
}

// Helper function to generate Contact query
function generateContactQuery(bpCode, contacts) {
  const contactQuery = contacts
    .map(contact => {
      return `SELECT '${bpCode}' AS BPCode, ${contact.lineID} AS LineID, '${contact.name}' AS ContactPerson, 
              '${contact.department}' AS ContactDepartment, '${contact.designation}' ContactDesignation, '${contact.phoneNo1}' ContactPhone,
              '${contact.phoneNo2}' ContactPhone1, '${contact.mobile}' ContactMobile, '${contact.fax}' ContactFax, '${contact.email}' ContactEMail, '${contact.website}' ContactWebSite,
              'Y' ContactActive`;
    })
    .join(" UNION ALL ");
  return contactQuery;
}

// Helper function to generate Contact query
function generateBankQuery(bpCode, bankings) {
  const bankingQuery = bankings
    .map(bank => {
      return `SELECT '${bpCode}' AS BPCode, ${bank.lineID} AS LineID, '${bank.bankName}' AS BankName, 
              '${bank.accountNo}' AS AccountNo, '${bank.branch}' Branch, '${bank.ifsc}' IFSC,
              '${bank.accountType}' AccountType`;
    })
    .join(" UNION ALL ");
  return bankingQuery;
}

// Endpoint to save customer address
app.post('/api/customersDetails', async (req, res) => {
  const { actiontype, bpCode, addresses, accountings, contacts, bankings } = req.body; // Get the bpCode and addresses from the request body
  // console.log(addresses);
  // Validate if bpCode and addresses array are provided
  // console.log(bpCode);
  // console.log(addresses);
  // console.log(accountings);
  // console.log(contacts);
  // console.log(bankings);
  // console.log(actiontype);

  if (!bpCode || !addresses || addresses.length === 0) {
    return res.status(400).json({
      messageID: '1',
      message: 'BP Code or Addresses are missing or invalid',
    });
  }
  if (!accountings || accountings.length === 0) {
    return res.status(400).json({
      messageID: '1',
      message: 'accountings are missing or invalid',
    });
  }
  if (!contacts || contacts.length === 0) {
    return res.status(400).json({
      messageID: '1',
      message: 'contacts are missing or invalid',
    });
  }
  if (!bankings || bankings.length === 0) {
    return res.status(400).json({
      messageID: '1',
      message: 'bankings are missing or invalid',
    });
  }

  // Generate the dynamic query using the provided bpCode and addresses
  const addressQuery = generateAddressQuery(bpCode, addresses);
  const accountQuery = generateAccountQuery(bpCode, accountings);
  const contactQuery = generateContactQuery(bpCode, contacts);
  const bankingQuery = generateBankQuery(bpCode, bankings);

  // console.log(`This is Address Query: ${addressQuery}`);
  // console.log(`This is Account Query: ${accountQuery}`);
  // console.log(`This is contact Query: ${contactQuery}`);
  // console.log(`This is bank Query: ${bankingQuery}`);

  // console.log(addressQuery);
  try {
    // Connect to the database
    // const pool = await sql.connect(dbConfig);
    const poolConnection = await getDbPool();

    // Call the stored procedure using mssql query method
    const result = await poolConnection.request()
      .input('ActionType', sql.NVarChar, actiontype)
      .input('BPCode', sql.NVarChar, addresses.bpCode)  // Pass the BPCode as parameter
      .input('AddressQuery', sql.NVarChar, addressQuery)  // Pass the AddressQuery as parameter
      .input('AccountQuery', sql.NVarChar, accountQuery)  // Pass the AccountQuery as parameter
      .input('ContactQuery', sql.NVarChar, contactQuery)  // Pass the ContactQuery as parameter
      .input('BankQuery', sql.NVarChar, bankingQuery)  // Pass the BankingQuery as parameter
      .execute('SP_Insert_Customer_Data1');  // Call the stored procedure

    // Close the database connection
    poolConnection.close();

    if (result.recordset && result.recordset.length > 0) {
      // Send success response
      res.status(200).json({
        message: result.recordset[0].RespMessage,
        messageID: result.recordset[0].RespCode
      });
    }

  } catch (error) {
    // Handle any errors that occur during the address save operation
    console.error("Error inserting data", error);
    res.status(500).json({ message: "Failed to insert data", error });
  }
});

// Endpoint to call tblf5 Grid
app.post('/api/getTblf5GridData', async (req, res) => {
  let poolConnection;
  try {
    const { formName, fieldName, fieldValue, searchTerm, page, pageSize } = req.body;

    // Ensure necessary fields are provided
    if (!formName || !fieldName) {
      return res.status(400).json({ message: 'formName and fieldName are required' });
    }

    // console.log(formName, fieldName);

    // Connect to the database
    // poolConnection = await pool.connect();
    const poolConnection = await getDbPool();

    // Fetch the query template from the database
    const queryResult = await poolConnection
      .request()
      .query(`SELECT Query FROM TBLF5 WHERE FormName='${formName}' AND FieldName='${fieldName}'`);

    if (!queryResult.recordset.length) {
      return res.status(404).json({ message: 'Query not found' });
    }

    let tableQuery = queryResult.recordset[0].Query;

    // Handle dynamic replacements for fieldValue
    if (fieldValue) {
      if (fieldName === 'BPGroup2') {
        tableQuery = tableQuery.replace('#BPGROUP1', fieldValue);
      } else if (fieldName === 'BPGroup3') {
        tableQuery = tableQuery.replace('#BPGROUP2', fieldValue);
      }
    }

    // Add search term filtering
    if (searchTerm) {
      // console.log(searchTerm);
      const searchCondition = ` (T0.BPName LIKE '%${searchTerm}%' OR T0.BPCode LIKE '%${searchTerm}%')`;
      // console.log(searchCondition);
      tableQuery = tableQuery.replace('Where', `WHERE${searchCondition} AND`);
      // console.log(tableQuery);
    }

    // Add paging logic
    const offset = (page - 1) * pageSize;
    const paginatedQuery = `
      SELECT * FROM (
        ${tableQuery}
      ) AS TempTable
      ORDER BY TempTable.LINEID
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY;
    `;

    const dataResult = await poolConnection.request().query(paginatedQuery);

    // Count total records
    const countQuery = `
      SELECT COUNT(*) AS TotalCount FROM (${tableQuery}) AS TempCount;
    `;
    const countResult = await poolConnection.request().query(countQuery);

    // Return data and total count
    res.json({
      data: dataResult.recordset,
      totalRecords: countResult.recordset[0].TotalCount,
    });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

  // finally {
  //   // Close the connection if it's open
  //   if (poolConnection) {
  //     poolConnection.close();
  //   }
  // }
});

// ........
app.post('/api/getCustomerViewData', async (req, res) => {
  let poolConnection;

  try {
    const { bpCode } = req.body;

    // poolConnection = await pool.connect();
    const poolConnection = await getDbPool();

    const result = await poolConnection
      .request()
      .input('BPCode', sql.NVarChar(20), bpCode)
      .execute('SP_Get_CustomerODTL');

    // Process the result
    const response = result.recordsets;

    if (response[0][0].RespCode === '1') {
      // Error or no data found
      res.status(200).json({
        RespCode: response[0][0].RespCode,
        RespMessage: response[0][0].RespMessage,
      });
    } else {
      // Return the fetched data
      res.status(200).json({
        RespCode: response[0][0].RespCode,
        RespMessage: response[0][0].RespMessage,
        MasterData: response[1], // OCRD data
        // Uncomment these if you enable CRD1, CRD4, etc. in the SP
        AddressData: response[2],
        AccountData: response[3],
        ContactData: response[4],
        BankingData: response[5],
      });
    }
  } catch (error) {
    console.error('Error fetching entry data:', error);
    res.status(500).json({ message: 'Failed to fetch entry data.' });
  }
});