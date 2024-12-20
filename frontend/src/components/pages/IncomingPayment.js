import React, { useState, useEffect } from "react";
import '../css/pages/IncomingPayment.css';
import DropDownBoxTable from "../dropdown/DropDownBoxTable";
import Panel from '../panel/Panel';
import DynamicGrid from "../grid/DynamicGrid";
import axios from 'axios';

const IncomingPayment = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [grids, setGrids] = useState({
        GrdBP: { columns: [], rows: [] },
        GrdAccounts: { columns: [], rows: [] },
        GrdOther: { columns: [], rows: [] },
    });
    // State to manage active tab
    const [activeTab, setActiveTab] = useState('entry'); // Default to 'entry' tab
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const [defaultDate, setDefaultDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    });

    useEffect(() => {
        const fetchGridData = async (grdName) => {
            try {
                const response = await axios.post(`${API_BASE_URL}/api/grdsTable`, {
                    formName: "FrmIncomingPayment",
                    grdName,
                });

                const filteredColumns = response.data.filter(col => col.Visible === "TRUE");

                setGrids((prev) => ({
                    ...prev,
                    [grdName]: {
                        ...prev[grdName],
                        columns: filteredColumns,
                    },
                }));
            } catch (error) {
                console.error(`Error fetching columns for ${grdName}:`, error);
            }
        };

        // Fetch column data for all grid names
        ["GrdBP", "GrdAccounts", "GrdOther"].forEach(fetchGridData);
    }, [API_BASE_URL]); // Add API_BASE_URL to the dependency array

    // Add a new row to a grid
    const handleAddRow = (e, grdName) => {
        e.preventDefault(); // Prevent form submission or page reload

        const newRow = {};
        grids[grdName].columns.forEach(col => {
            newRow[col.Tbl_Col_Name] = ''; // Default empty values
        });

        setGrids((prev) => ({
            ...prev,
            [grdName]: {
                ...prev[grdName],
                rows: [...prev[grdName].rows, newRow],
            },
        }));
    };

    // Update a cell in a grid
    const handleCellChange = (grdName, rowIndex, columnName, e) => {
        e.preventDefault(); // Prevent the page from reloading

        const value = e.target.value; // Get the new value from the input
        const updatedRows = [...grids[grdName].rows];
        updatedRows[rowIndex][columnName] = value;

        setGrids((prev) => ({
            ...prev,
            [grdName]: {
                ...prev[grdName],
                rows: updatedRows,
            },
        }));
    };

    const handleDeleteRow = (gridName, rowIndex) => {
        const updatedGrids = { ...grids };
        updatedGrids[gridName].rows.splice(rowIndex, 1); // Remove row at the given index
        setGrids(updatedGrids); // Update the grid state with the new rows
    };

    return (
        <div className="container-incoming-payment">
            <div className="container-form">
                <div className="tab-container">
                    <div className='container-head'>
                        <h6>Reciept Voucher</h6>
                    </div>
                    <ul className='tab-nav'>
                        <li
                            className={activeTab === 'entry' ? 'active' : ''}
                            onClick={() => handleTabClick('entry')}
                        >
                            <i className='bi bi-pencil-square'></i>
                        </li>
                        <li
                            className={activeTab === 'view' ? 'active' : ''}
                            onClick={() => handleTabClick('view')}
                        >
                            <i className='bi bi-eye'></i>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div className='tab-content'>
                    {activeTab === 'entry' && (
                        <div className='entry-tab'>
                            {/* <h6 className="d-flex justify-content-center">Entry Form</h6> */}
                            <form>
                                <div className="container-voucher-details">
                                    <div className="row">
                                        {/* Column to the Left Side */}
                                        <div className="col-md-6 col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="companyName">Company</label>
                                                <div className="input-group">
                                                    <DropDownBoxTable
                                                        id="companyName"
                                                        className="w-75"
                                                        placeholder="Select Company Name"
                                                        queryParams={{
                                                            formName: 'FrmIncomingPayment',
                                                            fieldName: 'TxtCompCode',
                                                            fieldValue: '',
                                                        }}
                                                        onSelect={(value, row) => {
                                                            document.getElementById('companyName').value = row?.CompName || '';
                                                            document.getElementById('companyCode').value = row?.CompCode || '';
                                                            document.getElementById('location').value = row?.Location || '';
                                                        }}
                                                    />
                                                    <div className="input-group-append w-25">
                                                        <input
                                                            type="text"
                                                            id="companyCode"
                                                            className="form-control input-group-text"
                                                            placeholder=""
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="location">Location</label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    className="form-control"
                                                    placeholder="Company Location"
                                                    readOnly
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="brokerName">Broker</label>
                                                <div className="input-group">
                                                    <DropDownBoxTable
                                                        id="brokerName"
                                                        className="w-75"
                                                        placeholder="Select Broker Name"
                                                        queryParams={{
                                                            formName: 'FrmIncomingPayment',
                                                            fieldName: 'BrokerDetails',
                                                            fieldValue: '',
                                                        }}
                                                        onSelect={(value, row) => {
                                                            document.getElementById('brokerName').value = row?.BPName || '';
                                                            document.getElementById('brokerCode').value = row?.BPCode || '';
                                                        }}
                                                    />
                                                    <div className="input-group-append w-25">
                                                        <input
                                                            type="text"
                                                            id='brokerCode'
                                                            className="form-control input-group-text"
                                                            placeholder=""
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="controlAcName">Control A/C</label>
                                                <div className="input-group">
                                                    <DropDownBoxTable
                                                        id="controlAcName"
                                                        className="w-75"
                                                        placeholder=""
                                                        queryParams={{
                                                            formName: 'FrmIncomingPayment',
                                                            fieldName: 'TxtGLControlAccount',
                                                            fieldValue: '',
                                                        }}
                                                        onSelect={(value, row) => {
                                                            document.getElementById('controlAcName').value = row?.GLName || '';
                                                            document.getElementById('controlAcCode').value = row?.GLCode || '';
                                                        }}
                                                    />
                                                    <div className="input-group-append w-25">
                                                        <input
                                                            type="text"
                                                            id='controlAcCode'
                                                            className="form-control input-group-text"
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label>Customer</label>
                                                        <DropDownBoxTable
                                                            id="customerCode"
                                                            className=""
                                                            placeholder=""
                                                            queryParams={{
                                                                formName: 'FrmIncomingPayment',
                                                                fieldName: 'TxtBPDetails',
                                                                fieldValue: '',
                                                            }}
                                                            onSelect={(value, row) => {
                                                                document.getElementById('customerName').value = row?.BPName || '';
                                                                document.getElementById('customerCode').value = row?.BPCode || '';
                                                                document.getElementById('controlAcName').value = row?.GLName || '';
                                                                document.getElementById('controlAcCode').value = row?.GLCode || '';
                                                                document.getElementById('receivedFrom').value = row?.BPName || '';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label>GSTIN</label>
                                                        <input
                                                            style={{ backgroundColor: "#e6ffe4" }}
                                                            type="text"
                                                            id="gstIN"
                                                            className="form-control"
                                                            placeholder="GST Num"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Customer Name</label>
                                                <DropDownBoxTable
                                                    id="customerName"
                                                    className=""
                                                    placeholder=""
                                                    queryParams={{
                                                        formName: 'FrmIncomingPayment',
                                                        fieldName: 'TxtBPDetails',
                                                        fieldValue: '',
                                                    }}
                                                    onSelect={(value, row) => {
                                                        document.getElementById('customerName').value = row?.BPName || '';
                                                        document.getElementById('customerCode').value = row?.BPCode || '';
                                                        document.getElementById('controlAcName').value = row?.GLName || '';
                                                        document.getElementById('controlAcCode').value = row?.GLCode || '';
                                                        document.getElementById('receivedFrom').value = row?.BPName || '';
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Received From</label>
                                                <input
                                                    type="text"
                                                    id="receivedFrom"
                                                    className="form-control"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>

                                        {/* Column to the Right Side */}
                                        <div className="col-md-6 col-sm-6">
                                            <div className="form-group">
                                                <label>Bank/Cash</label>
                                                <div className="input-group">
                                                    <DropDownBoxTable
                                                        id="bankGLName"
                                                        className="w-75"
                                                        placeholder=""
                                                        queryParams={{
                                                            formName: 'FrmIncomingPayment',
                                                            fieldName: 'TxtBankDetails',
                                                            fieldValue: '',
                                                        }}
                                                        onSelect={(value, row) => {
                                                            document.getElementById('bankGLName').value = row?.GLName || '';
                                                            document.getElementById('bankGLCode').value = row?.GLCode || '';
                                                        }}
                                                    />
                                                    <div className="input-group-append w-25">
                                                        <input
                                                            type="text"
                                                            id='bankGLCode'
                                                            className="form-control input-group-text"
                                                            placeholder=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="postingDate">Posting Date</label>
                                                        <input
                                                            id='postingDate'
                                                            type='date'
                                                            className="form-control"
                                                            value={defaultDate} // Sets today's date as default
                                                            onChange={(e) => setDefaultDate(e.target.value)} // Update state on change
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6"></div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="series">Series</label>
                                                        <select
                                                            className="form-select"
                                                            id='series'>
                                                            <option value='' disabled>--Select--</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="seriesNo">No.</label>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            id='seriesNo'
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="chequeNo">Cheque No.</label>
                                                        <input
                                                            type="text"
                                                            id="chequeNo"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="chequeDate">Date</label>
                                                        <input
                                                            id='chequeDate'
                                                            type='date'
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="payableAt">Payable At</label>
                                                <input
                                                    type="text"
                                                    id="payableAt"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="refDate">Reference Date</label>
                                                        <input
                                                            type="date"
                                                            id="refDate"
                                                            className="form-control"
                                                            value={defaultDate}
                                                            onChange={(e) => setDefaultDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="refNo">No.</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="refNo"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label htmlFor="balance">Balance</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="balance"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* --- incoming - panels start here ---- */}
                                <div className="container-other-details">
                                    <Panel title='Customer'>
                                        <button type="button" className="btn btn-primary mb-2" onClick={(e) => handleAddRow(e, 'GrdBP')}>
                                            Add Row
                                        </button>
                                        <DynamicGrid
                                            columns={grids.GrdBP.columns}
                                            rows={grids.GrdBP.rows}
                                            onAddRow={handleAddRow}
                                            onCellChange={(rowIndex, columnName, value, e) => handleCellChange('GrdBP', rowIndex, columnName, e)} // Pass event here
                                            onDeleteRow={(rowIndex) => handleDeleteRow('GrdBP', rowIndex)} // Pass delete handler
                                        />
                                    </Panel>
                                    <Panel title='Account'>
                                        <button type="button" className="btn btn-primary mb-2" onClick={(e) => handleAddRow(e, 'GrdAccounts')}>
                                            Add Row
                                        </button>
                                        <DynamicGrid
                                            columns={grids.GrdAccounts.columns}
                                            rows={grids.GrdAccounts.rows}
                                            onAddRow={handleAddRow}
                                            onCellChange={(rowIndex, columnName, value, e) => handleCellChange('GrdAccounts', rowIndex, columnName, e)} // Pass event here
                                            onDeleteRow={(rowIndex) => handleDeleteRow('GrdAccounts', rowIndex)} // Pass delete handler
                                        />
                                    </Panel>
                                    <Panel title='Attachments'>
                                        <p>Details about Attachments information can go here.</p>
                                    </Panel>
                                    <Panel title='Other Charges'>
                                        <button type="button" className="btn btn-primary mb-2" onClick={(e) => handleAddRow(e, 'GrdOther')}>
                                            Add Row
                                        </button>
                                        <DynamicGrid
                                            columns={grids.GrdOther.columns}
                                            rows={grids.GrdOther.rows}
                                            onAddRow={handleAddRow}
                                            onCellChange={(rowIndex, columnName, value, e) => handleCellChange('GrdOther', rowIndex, columnName, e)} // Pass event here
                                            onDeleteRow={(rowIndex) => handleDeleteRow('GrdOther', rowIndex)} // Pass delete handler           
                                        />
                                    </Panel>
                                </div>
                                <div className="mt-2 d-flex justify-content-between">
                                    <div className="form-group">
                                        <label htmlFor="oremarks" className="fs-6">Remarks</label>
                                        <textarea
                                            className="form-control h-75"
                                            id="oremarks"
                                            inputMode="text"
                                            rows="4"
                                            cols="50"
                                        />
                                    </div>
                                    <div className="base-level">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <div className="form-group m-0 row">
                                                    <label className="col-md-5 col-lg-5 p-1" htmlFor="recordFY">
                                                        FY Recd Till Date
                                                    </label>
                                                    <div className="col-md-7 col-lg-7 p-1">
                                                        <input type="text"
                                                            className="form-control"
                                                            id="recordFY"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="form-group m-0 row">
                                                    <label htmlFor="onAccount" className="col-md-5 col-lg-5 p-1">
                                                        On Account
                                                    </label>
                                                    <div className="col-md-7 col-lg-7 p-1">
                                                        <input type='text'
                                                            id="onAccount"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group m-0 row">
                                                    <label htmlFor="grossAmount" className="col-md-5 col-lg-5 p-1">
                                                        Gross Amount
                                                    </label>
                                                    <div className="col-md-7 col-lg-7 p-1">
                                                        <input type='text'
                                                            id="grossAmount"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group m-0 row">
                                                    <label htmlFor="tdsBaseAmt" className="col-md-5 col-lg-5 p-1">
                                                        TDS Base Amt.
                                                    </label>
                                                    <div className="col-md-7 col-lg-7 p-1">
                                                        <input type='text'
                                                            id="tdsBaseAmt"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="base-level">
                                        <div className="form-group m-0 row">
                                            <label htmlFor="lessTDS" className="col-md-5 col-lg-5 p-1">
                                                Less : TDS
                                            </label>
                                            <div className="col-md-7 col-lg-7 p-1">
                                                <input type='text'
                                                    id="lessTDS"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 row">
                                            <label htmlFor="lessOthCharges" className="col-md-5 col-lg-5 p-1">
                                                Less : Other Charges
                                            </label>
                                            <div className="col-md-7 col-lg-7 p-1">
                                                <input type='text'
                                                    id="lessOthCharges"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 row">
                                            <label htmlFor="netAmount" className="col-md-5 col-lg-5 p-1">
                                                Net Amount
                                            </label>
                                            <div className="col-md-7 col-lg-7 p-1">
                                                <input type='text'
                                                    id="netAmount"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-action-button mt-2'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        id='btnSave'
                                    >
                                        {/* {isEditMode ? 'Update' : 'Save'} */}
                                        Save
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        id='btnCancel'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'view' && (
                        <div className="view-tab">
                            <h6 className="d-flex justify-content-center">View Form</h6>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IncomingPayment;