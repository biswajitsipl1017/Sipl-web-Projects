import React from 'react';
import '../css/grid/DynamicGrid.css';
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DynamicGrid = ({ columns, rows, onAddRow, onCellChange, onDeleteRow }) => {
    // Add an action column to the columns array for the delete button
    const columnsWithAction = [...columns, { ColHdName: 'Action', ColHdText: 'Actions' }];

    return (
        <div className="table-wrapper">
            <table className="table table-bordered" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                    <tr>
                        {columnsWithAction.map(col => (
                            <th
                                key={col.ColHdName}
                                style={{
                                    width: col.ColWidth ? `${col.ColWidth}px` : 'auto',
                                    textAlign: col.TextAlignment || 'left',
                                }}
                            >
                                {col.ColHdText}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map(col => (
                                <td key={col.ColHdName}>
                                    {col.ColType === 'DataGridViewTextBoxColumn' && (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={row[col.Tbl_Col_Name]}
                                            onChange={(e) => onCellChange(rowIndex, col.Tbl_Col_Name, e.target.value, e)} // Pass event here
                                        />
                                    )}
                                    {col.ColType === 'DataGridViewCheckBoxColumn' && (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={row[col.Tbl_Col_Name] === "TRUE"}
                                            onChange={(e) =>
                                                onCellChange(rowIndex, col.Tbl_Col_Name, e.target.checked ? "TRUE" : "FALSE", e) // Pass event here
                                            }
                                        />
                                    )}
                                </td>
                            ))}
                            {/* Action column for deleting a row */}
                            <td className='d-flex align-self-center'>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm mx-1 mt-1"
                                    onClick={() => onDeleteRow(rowIndex)} // Call the delete function when clicked
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default DynamicGrid;
