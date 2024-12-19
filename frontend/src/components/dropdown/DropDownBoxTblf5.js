import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import '../css/dropdown/DropDownTblf5.css';
import useDebounce from '../dropdown/useDebounce';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DropDownBoxTblf5 = React.memo(({ id, queryParams, placeholder, onSelect }) => {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/getTblf5Data`, {
                    ...queryParams,
                    fieldName: id,
                });
                setData(response.data || []);
            } catch (error) {
                console.error('Error fetching table data:', error);
            }
        };

        fetchData();
    }, [queryParams, id]);

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
            if (!debouncedSearchTerm) return true; // Return all rows if no search term
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

        // Custom logic for ParentName field
        if (id === 'ParentName') {
            const parentCode = row.ParentCode || ''; // Assuming the row contains ParentCode
            onSelect({ ParentName: value, ParentCode: parentCode });
        } 
        else if(id === 'BPGroup1') {
            onSelect({ BPGroup1: value});
        } 
        else if(id === 'BPGroup2') {
            onSelect({ BPGroup2: value});
        } 
        else if(id === 'BPGroup3') {
            onSelect({ BPGroup3: value});
        }
        else {
            onSelect(value);
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);

        // if (inputValue === '') {
        //     setSelectedValue('');
        //     onSelect(null);
        // }
        if (inputValue === '') {
            // We are clearing only the search term, but keeping selectedValue intact
            onSelect(null); // Optionally call onSelect with null if necessary
        }
    };

    return (
        <div className="dropdown-box" ref={dropdownRef}>
            <input
                type="text"
                className="form-select"
                placeholder={placeholder || 'Select a value'}
                onFocus={() => setIsOpen(true)}
                value={searchTerm !== '' ? searchTerm : selectedValue}  
                onChange={handleInputChange}
            />
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
                                filteredData.map((row = {}, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRowSelect(row)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {Object.values(row).map((cell = 'N/A', cellIndex) => (
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

export default DropDownBoxTblf5;
