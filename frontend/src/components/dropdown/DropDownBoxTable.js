import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import '../css/dropdown/DropDownTblf5.css';
import useDebounce from './useDebounce';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DropDownBoxTable = React.memo(({ id, queryParams, placeholder, onSelect, className }) => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/getTableData`, {
                    ...queryParams,
                });
                setData(response.data || []);
            } catch (error) {
                console.error('Error fetching table data:', error);
            }
        };

        fetchData();
        return () => {
            setData([]);
        };
    }, [queryParams]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            if (!debouncedSearchTerm) return true;
            return Object.values(row).some((cell) =>
                cell?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        });
    }, [data, debouncedSearchTerm]);

    const handleRowSelect = (row) => {
        const value = row[id];
        setSelectedValue(value);
        setSearchTerm(value);
        setIsOpen(false);
        if (onSelect) onSelect(value, row); // Pass value and entire row to parent
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);

        if (inputValue === '') {
            setSelectedValue('');
            if (onSelect) onSelect(null, null);
        }
    };

    return (
        <div className={`dropdown-box ${className}`} ref={dropdownRef}>
            <input
                type="text"
                id={id}
                className="form-select"
                placeholder={placeholder || 'Select a value'}
                onFocus={() => setIsOpen(true)}
                value={searchTerm !== '' ? searchTerm : selectedValue}
                onChange={handleInputChange}
            />
            {/* <div className="input-group">
                <div className="input-group-append">
                    <span
                        className="input-group-text"
                        onClick={() => setIsOpen((prev) => !prev)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="bi bi-caret-down-fill"></i>
                    </span>
                </div>
            </div> */}
            {isOpen && (
                <div className="dropdown-table">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {data.length > 0 &&
                                    Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRowSelect(row)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {Object.values(row).map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell || 'N/A'}</td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="100%">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
});

export default DropDownBoxTable;
