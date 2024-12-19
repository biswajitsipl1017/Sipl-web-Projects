import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import '../css/table/Tblf5Grid.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Tblf5Grid = ({ formName, fieldName, onSelectRow, setActiveTab }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);

  // const handleViewAction = (row) => {
  //   // console.log("View action triggered for BPCode:", row["BPCode"]);
  //   alert(`View action triggered for BPCode: ${row["BPCode"]}`);
  //   // Add your custom logic here
  // };

  const handleViewAction = async (row) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/getCustomerViewData`, {
        bpCode: row.BPCode,
      });
      const fetchedData = response.data;
      // console.log(fetchedData);
      // Pass the fetched data to the parent component
      onSelectRow(fetchedData);

      // Optionally switch to the "entry" tab
      setActiveTab('entry');
    } catch (error) {
      console.error('Error fetching entry data:', error);
      alert('Failed to fetch data for the selected BPCode.');
    }
  };
  

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/getTblf5GridData`, {
        formName,
        fieldName,
        fieldValue: '', // Adjust this if needed
        searchTerm,
        page,
        pageSize,
      });

      setData(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [formName, fieldName, searchTerm, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  //   setPage(1); // Reset to the first page when searching
  // };

  const timeoutId = useRef(null); // Declare timeoutId to store the timeout reference

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to the first page when searching
  
    // Clear the previous timeout to avoid multiple function calls
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  
    // Set a new timeout to delay the search logic
    timeoutId.current = setTimeout(() => {
      console.log('Searching for:', value);
    }, 500);
  };

  // Get the headers dynamically based on the data keys
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="table-container">
      {/* Flex container for search and page size */}
      <div className="flex-container">
        {/* Search Input */}
        <input
          id="search-grid"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className='form-control'
        />

        {/* Rows per page dropdown */}
        <div className="page-size-container">
          <label htmlFor="page-size">Show entries:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <table className="table">
        <thead>
          <tr>
            {/* Dynamically generate table headers */}
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            {/* Add a header for the action column */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Dynamically generate table rows */}
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, subIndex) => (
                <td key={subIndex} title={row[header]}>{row[header]}</td>
              ))}
              {/* Add an action button in the last column */}
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewAction(row)}
                >
                  <i className="bi bi-eye"></i> {/* Bootstrap View Icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          className={page <= 1 ? "disabled" : ""}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className={page * pageSize >= totalRecords ? "disabled" : ""}
          disabled={page * pageSize >= totalRecords}
        >
          Next
        </button>
      </div>
    </div>
  );

};


export default Tblf5Grid;
