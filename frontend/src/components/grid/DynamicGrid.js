import React, { useRef, useEffect } from 'react';
import '../css/grid/DynamicGrid.css';

const DynamicGrid = ({ columns, rows, onAddRow, onCellChange, onDeleteRow }) => {
    // Ref for the table
    const tableRef = useRef(null);

    // Function to make columns resizable
    const makeColumnsResizable = () => {
        const table = tableRef.current;
        if (!table) return;

        table.querySelectorAll('th').forEach((th) => {
            const resizer = document.createElement('div');
            resizer.style.width = '5px';
            resizer.style.cursor = 'col-resize';
            resizer.style.position = 'absolute';
            resizer.style.right = '0';
            resizer.style.top = '0';
            resizer.style.bottom = '0';
            resizer.style.backgroundColor = 'transparent';
            th.style.position = 'relative';
            th.appendChild(resizer);

            let startX, startWidth;

            resizer.addEventListener('mousedown', (e) => {
                startX = e.pageX;
                startWidth = th.offsetWidth;

                const resize = (e) => {
                    const newWidth = startWidth + (e.pageX - startX);
                    th.style.width = `${newWidth}px`;
                };

                const stopResize = () => {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            });
        });
    };

    // Initialize resizable columns after the component mounts
    useEffect(() => {
        makeColumnsResizable();
    }, []);

    const columnsWithAction = [...columns, { ColHdName: 'Action', ColHdText: 'Actions' }];

    return (
        <div className="table-wrapper">
            <table
                className="table table-bordered"
                ref={tableRef}
                style={{ tableLayout: 'fixed', width: '100%' }}
            >
                <thead>
                    <tr>
                        {columnsWithAction.map((col) => (
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
                            {columns.map((col) => (
                                <td key={col.ColHdName}>
                                    {col.ColType === 'DataGridViewTextBoxColumn' && (
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={(e) =>
                                                onCellChange(rowIndex, col.Tbl_Col_Name, e.target.value, e)
                                            }
                                        />
                                    )}
                                    {col.ColType === 'DataGridViewCheckBoxColumn' && (
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            onChange={(e) =>
                                                onCellChange(
                                                    rowIndex,
                                                    col.Tbl_Col_Name,
                                                    e.target.checked ? 'Y' : 'Z', e)
                                            }
                                        />
                                    )}
                                </td>
                            ))}
                            {/* Action column for deleting a row */}
                            <td className="d-flex align-self-center">
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm mx-1 mt-1"
                                    onClick={() => onDeleteRow(rowIndex)}
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
