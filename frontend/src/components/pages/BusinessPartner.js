import React, { useState, useEffect } from 'react';
import '../css/pages/BusinessPartner.css';
import BusinessPartnerPanel from '../panel/BusinessPartnerPanel';
import axios from 'axios';
import DropDownBoxTblf5 from '../dropdown/DropDownBoxTblf5';
// import Tblf5Grid from './Tblf5Grid';

const GridviewTblf5 = React.lazy(() => import('../table/Tblf5Grid'));

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BusinessPartner = () => {
    const [isEditMode, setIsEditMode] = useState(false);

    const formatDate = (date) => {
        if (!date) return ""; // Handle null/undefined dates
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    };

    const [currencies, setCurrencies] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const sessionUserDetails = JSON.parse(sessionStorage.getItem('user'));
    const userid = sessionUserDetails?.userID;

    // Address Table Start
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [modalAddress, setModalAddress] = useState({
        lineID: null,
        location: '',
        country: '',
        city: '',
        state: '',
        zip: '',
        address1: '',
        address2: '',
        address3: '',
        phone1: '',
        phone2: '',
        mobile: '',
        email: '',
        website: '',
        fax: '',
        gstSelect: 'Y',
        gstNum: '',
        tanNum: '',
        sezChecked: 'N',
        compositGstChecked: 'N',
        activeChecked: 'N',
        addressApprChecked: 'N',
    });

    // Define OCRD Fields below
    const [customerODetail, setCustomerODetail] = useState({
        bpCode: '',
        bpShortName: '',
        bpName: '',
        bpDisplayName: '',
        proprietor: '',
        unitOfGroup: '',
        parentBPCode: '',
        parentBPName: '',
        BPGroup1: '',
        BPGroup2: '',
        BPGroup3: '',
        vat: '',
        cst: '',
        tin: '',
        sgst: '',
        cgst: '',
        igst: '',
        pan: '',
        tmco: '',
        esi: '',
        bpCurrency: '',
        balance: '',
        bankCode: '',
        bankName: '',
        eccNo: '',
        ceRegistrationNo: '',
        ceRange: '',
        ceCommissionorate: '',
        serviceTaxNo: '',
        dcRegNo: '',
        bioCardNo: '',
        msmeCategory: '',
        msmeRegNo: '',
        msmeRegDate: '',
        msmeValidUpto: '',
        paymentMode: '',
        paymentTerm: '',
        creditLimit: '',
        glCess: 'N',
        aastga: 'N',
        active: 'N',
        approved: 'N'
    });

    useEffect(() => {
        console.log("Updated customerODetail:", customerODetail);
    }, [customerODetail]); // This will log whenever customerODetail changes

    ///// New Code below ////////////////////
    const handleSelectRow = (data) => {
        const masterData = data.MasterData[0];

        const addressData = data.AddressData.map((address) => ({
            lineID: address.LineID,
            location: address.Location,
            country: address.Country,
            city: address.City,
            state: address.State,
            zip: address.PIN,
            address1: address.Add1,
            address2: address.Add2,
            address3: address.Add3,
            phone1: address.Phone1,
            phone2: address.Phone2,
            mobile: address.Mobile,
            email: address.EMail,
            website: address.WebSite,
            fax: address.Fax,
            gstSelect: address.GSTType,
            gstNum: address.GSTIN,
            tanNum: address.TANNo,
            sezChecked: address.SEZ,
            compositGstChecked: address.CompositGST,
            activeChecked: address.ActiveRow,
            addressApprChecked: address.ApprovedRow,
        }));

        const AccountData = data.AccountData.map((account) => ({
            lineID: account.LineID,
            glCode: account.GLCode,
            glName: account.GLName,
            balance: account.Balance || '',
            mGroup1: account.MGroup1,
            mGroup2: account.MGroup2,
            mGroup3: account.MGroup3,
        }));

        const ContactData = data.ContactData.map((contact) => ({
            lineID: contact.LineID,
            name: contact.ContactPerson,
            department: contact.ContactDepartment,
            designation: contact.ContactDesignation,
            phoneNo1: contact.ContactPhone,
            phoneNo2: contact.ContactPhone1,
            mobile: contact.ContactMobile,
            fax: contact.ContactFax,
            email: contact.ContactEMail,
            website: contact.ContactWebSite,
            active: contact.ContactActive,
        }));

        const BankingData = data.BankingData.map((bank) => ({
            lineID: bank.LineID,
            bankName: bank.BankName,
            accountNo: bank.AccountNo,
            branch: bank.Branch,
            ifsc: bank.IFSC,
            accountType: bank.AccountType,
        }));


        // Update the form state with fetched Customer Master Data
        setCustomerODetail({
            bpCode: masterData.BPCode,
            bpShortName: masterData.BPShortName,
            bpName: masterData.BPName,
            bpDisplayName: masterData.BPDisplayName,
            proprietor: masterData.ProprietorName,
            unitOfGroup: masterData.UnitOfGroup,
            parentBPCode: masterData.ParentBPCode,
            parentBPName: masterData.ParentBPName,// Not getting filled
            BPGroup1: masterData.BPGroup1,// Not getting filled
            BPGroup2: masterData.BPGroup2,// Not getting filled
            BPGroup3: masterData.BPGroup3,// Not getting filled
            vat: masterData.VAT,
            cst: masterData.CST,
            tin: masterData.TIN,
            sgst: masterData.SGST,
            cgst: masterData.CGST,
            igst: masterData.IGST,
            pan: masterData.PAN,
            tmco: masterData.TMCO,
            esi: masterData.ESI,
            bpCurrency: masterData.Currency,
            balance: '',
            bankCode: '',
            bankName: '',
            eccNo: masterData.ECCNo,
            ceRegistrationNo: masterData.CERegistrationNo,
            ceRange: masterData.CERange,
            ceCommissionorate: masterData.CECommissionorate,
            serviceTaxNo: masterData.ServiceTaxNo,
            dcRegNo: masterData.DCRegNo,
            bioCardNo: masterData.BioCardNo,
            msmeCategory: masterData.MSMECategory,
            msmeRegNo: masterData.MSMERegNo,
            msmeRegDate: formatDate(masterData.MSMERegDate),
            msmeValidUpto: formatDate(masterData.MSMEValidUpTo),
            paymentMode: masterData.PaymentMode,
            paymentTerm: masterData.PaymentTerm,
            creditLimit: masterData.CreditLimit,
            glCess: masterData.GLCess,
            aastga: masterData.AASTGA,
            active: masterData.Active,
            approved: masterData.Approved,
        });

        // Update the form state with fetched Address and other child tables
        setAddresses(addressData);
        setAccounts(AccountData);
        setContacts(ContactData);
        setBankings(BankingData);

        // Switch to the "entry" tab
        setActiveTab('entry');
        // When populating the form for editing:
        setIsEditMode(true);
    };

    const handleSetActiveTab = (tab) => {
        console.log('Active tab set to:', tab);
        // Change the active tab
    };
    ///// Old Code below //////////////////

    // handle form submission button click
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!customerODetail.bpCode || !customerODetail.bpName) {
            alert('Please fill in all required fields.');
            setIsLoading(false);
            return;
        }

        try {
            // Set ActionType based on mode
            const actiontype = isEditMode ? 'Update' : 'Save';

            // console.log(actiontype);

            // First save customer details
            const response = await axios.post(`${API_BASE_URL}/api/customersODetail`, customerODetail,
                {
                    headers: { userid, actiontype },
                }
            );

            // console.log(response.data);

            if (response.data.messageID === '0') {
                // If customer details saved successfully, call the address save endpoint
                const addressPayload = addresses.map((address) => ({
                    lineID: address.lineID,
                    location: address.location,
                    country: address.country,
                    city: address.city,
                    state: address.state,
                    zip: address.zip,
                    address1: address.address1,
                    address2: address.address2,
                    address3: address.address3,
                    phone1: address.phone1,
                    phone2: address.phone2,
                    mobile: address.mobile,
                    email: address.email,
                    website: address.website,
                    fax: address.fax,
                    gstSelect: address.gstSelect,
                    gstNum: address.gstNum,
                    tanNum: address.tanNum,
                    sezChecked: address.sezChecked,
                    compositGstChecked: address.compositGstChecked,
                    activeChecked: address.activeChecked,
                    addressApprChecked: address.addressApprChecked,
                    // Sending BPCode from customerODetail
                }));

                const accountPayload = accounts.map((account) => ({
                    lineID: account.lineID,
                    glCode: account.glCode,
                    glName: account.glName,
                    balance: account.balance,
                    mGroup1: account.mGroup1,
                    mGroup2: account.mGroup2,
                    mGroup3: account.mGroup3,
                }));

                const contactPayload = contacts.map((contact) => ({
                    lineID: contact.lineID,
                    name: contact.name,
                    department: contact.department,
                    designation: contact.designation,
                    phoneNo1: contact.phoneNo1,
                    phoneNo2: contact.phoneNo2,
                    mobile: contact.mobile,
                    fax: contact.fax,
                    email: contact.email,
                    website: contact.website,
                }));

                const bankPayload = bankings.map((bank) => ({
                    lineID: bank.lineID,
                    bankName: bank.bankName,
                    accountNo: bank.accountNo,
                    branch: bank.branch,
                    ifsc: bank.ifsc,
                    accountType: bank.accountType,
                }));

                // Now send address data to save
                const addressResponse = await axios.post(`${API_BASE_URL}/api/customersDetails`, {
                    actiontype,
                    bpCode: customerODetail.bpCode,
                    addresses: addressPayload,
                    accountings: accountPayload,
                    contacts: contactPayload,
                    bankings: bankPayload
                });

                // console.log(addressResponse.data);

                if (addressResponse.data.messageID === '0') {
                    alert(addressResponse.data.message);

                } else {
                    alert(addressResponse.data.message);
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // handle selection for BP Groups and BP Parent
    const handleSelect = (selectedData) => {
        if (selectedData) {
            if (selectedData.ParentName && selectedData.ParentCode) {
                // Update both ParentName and ParentCode
                setCustomerODetail({
                    ...customerODetail,
                    parentBPName: selectedData.ParentName,
                    parentBPCode: selectedData.ParentCode,
                });
            }
            else if (selectedData.BPGroup1) {
                setCustomerODetail({
                    ...customerODetail,
                    BPGroup1: selectedData.BPGroup1,
                });
            }
            else if (selectedData.BPGroup2) {
                setCustomerODetail({
                    ...customerODetail,
                    BPGroup2: selectedData.BPGroup2,
                });
            }
            else if (selectedData.BPGroup3) {
                setCustomerODetail({
                    ...customerODetail,
                    BPGroup3: selectedData.BPGroup3,
                });
            }
            else {
                // Default behavior for other fields
                setCustomerODetail({
                    ...customerODetail,
                    [selectedData.id]: selectedData.id,
                });
            }
        } else {
            // Clear ParentName and ParentCode if selection is cleared
            setCustomerODetail({
                ...customerODetail,
                parentBPName: '',
                parentBPCode: '',
                BPGroup1: '',
                BPGroup2: '',
                BPGroup3: '',
            });
        }
        console.log("Before setState:", customerODetail);  // Logs before state update
        setCustomerODetail(selectedData);
        console.log("After setState:", customerODetail);
    };

    // handle category 
    const handleCategoryChange = (value) => {
        setCustomerODetail({
            ...customerODetail,
            msmeCategory: value, // Update the msmeCategory field
        });
    };

    // Fetch currencies from the backend
    useEffect(() => {
        axios
            .post(`${API_BASE_URL}/api/getCurrencies`, {}) // POST request with an empty body
            .then((response) => {
                //console.log('Fetched currencies:', response.data); // Debug log
                setCurrencies(response.data);
            })
            .catch((error) => {
                console.error('Error fetching currencies:', error);
            });
    }, []);

    // Fetch countries from the backend
    useEffect(() => {
        axios
            .post(`${API_BASE_URL}/api/getCountries`, {})
            .then((response) => {
                setCountries(response.data);
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    // Handle country change
    const handleCountryChange = (selectedCountry) => {
        // Update the country in state
        setModalAddress((prev) => ({ ...prev, country: selectedCountry, state: '' }));

        // Fetch states for the selected country
        if (selectedCountry) {
            axios
                .post(`${API_BASE_URL}/api/getStates?country=${encodeURIComponent(selectedCountry)}`, {})
                .then((response) => {
                    setStates(response.data); // Update the states dropdown
                })
                .catch((error) => {
                    console.error('Error fetching states:', error);
                });
        } else {
            setStates([]); // Clear states if no country is selected
        }
    };

    // State to manage active tab
    const [activeTab, setActiveTab] = useState('entry'); // Default to 'entry' tab
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const hanldeAddressEdit = (index) => {
        const selectedAddress = addresses[index];
        setModalAddress(selectedAddress); // Populate modal with selected row data
        setEditIndex(index); // Track the index of the row being edited
        setIsEditing(true); // Switch to editing mode
        setShowAddressModal(true); // Show the modal
    };

    const hanldeAddressDelete = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses); // Update the state
    };

    // Account Table Start
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [modalAccount, setModalAccount] = useState({
        lineID: null,
        glCode: '',
        glName: '',
        balance: '',
        mGroup1: '',
        mGroup2: '',
        mGroup3: '',
    });

    const handleAccountEdit = (index) => {
        const selectedAccounts = accounts[index];
        setModalAccount(selectedAccounts);
        setEditIndex(index);
        setIsEditing(true);
        setShowAccountModal(true);
    };

    const handleAccountDelete = (index) => {
        const updatedAccounts = accounts.filter((_, i) => i !== index);
        setAccounts(updatedAccounts);
    };

    // Contact Table Start
    const [showContactModal, setShowContactModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [modalContact, setModalContact] = useState({
        lineID: null,
        name: '',
        department: '',
        designation: '',
        phoneNo1: '',
        phoneNo2: '',
        mobile: '',
        fax: '',
        email: '',
        website: '',
    });

    const handleContactEdit = (index) => {
        const selectedcontacts = contacts[index];
        setModalContact(selectedcontacts);
        setEditIndex(index);
        setIsEditing(true);
        setShowContactModal(true);
    };

    const handleContactDelete = (index) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    // Banking Table Start
    const [showBankingModal, setShowBankingModal] = useState(false);
    const [bankings, setBankings] = useState([]);
    const [modalBanking, setModalBanking] = useState({
        lineID: null,
        bankName: '',
        accountNo: '',
        branch: '',
        ifsc: '',
        accountType: '',
    });

    const handleBankingEdit = (index) => {
        const selectedBankings = bankings[index];
        setModalBanking(selectedBankings);
        setEditIndex(index);
        setIsEditing(true);
        setShowBankingModal(true);
    };

    const handleBankingDelete = (index) => {
        const updatedBankings = bankings.filter((_, i) => i !== index);
        setBankings(updatedBankings);
    };

    return (
        <div className='container-business-partner'>
            {/* Header */}
            

            {/* Form Container */}
            <div className='container-form'>
                {/* Tabs Navigation */}
                <div className='tab-container'>
                    <div className='container-head'>
                        <h6>Subledger Master</h6>
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
                            <form onSubmit={handleSubmitForm}>
                                <div className='container-BPDetails'>
                                    <div className='row'>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className='row'>
                                                <div className='col-md-6 col-sm-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor='BPCode'>Code</label>
                                                        <input
                                                            type='text'
                                                            id='BPCode'
                                                            className='form-control'
                                                            placeholder='Customer Code'
                                                            value={customerODetail.bpCode}
                                                            readOnly={isEditMode}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, bpCode: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-md-6 col-sm-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor='BPShortName'>Short Name</label>
                                                        <input
                                                            type='text'
                                                            id='BPShortName'
                                                            className='form-control'
                                                            placeholder='Short Name'
                                                            value={customerODetail.bpShortName}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, bpShortName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='BPName'>Name</label>
                                                <input
                                                    type='text'
                                                    id='BPName'
                                                    className='form-control'
                                                    placeholder='Customer Name'
                                                    value={customerODetail.bpName}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, bpName: e.target.value })}
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='BPDisplayName'>Display Name</label>
                                                <input
                                                    type='text'
                                                    id='BPDisplayName'
                                                    className='form-control'
                                                    placeholder='Customer Name'
                                                    value={customerODetail.bpDisplayName}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, bpDisplayName: e.target.value })}
                                                />
                                            </div>

                                            <div className='form-group'>
                                                <label htmlFor='Proprietor'>Proprietor</label>
                                                <input
                                                    type='text'
                                                    id='Proprietor'
                                                    className='form-control'
                                                    placeholder='Propreietor'
                                                    value={customerODetail.proprietor}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, proprietor: e.target.value })}
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='UnitOfGroup'>Unit of Group</label>
                                                <input
                                                    type='text'
                                                    id='UnitGroup'
                                                    className='form-control'
                                                    placeholder='Unit Of Group'
                                                    value={customerODetail.unitOfGroup}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, unitOfGroup: e.target.value })}
                                                />
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-3 col-sm-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor='ParentCode'>Parent Code</label>
                                                        <input
                                                            type='text'
                                                            id='ParentCode'
                                                            className='form-control'
                                                            placeholder='Parent Code'
                                                            readOnly
                                                            value={customerODetail.parentBPCode}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, parentBPCode: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-md-9 col-sm-6'>
                                                    <div className="form-group">
                                                        <label htmlFor="ParentName">Parent Name</label>
                                                        <DropDownBoxTblf5
                                                            id="ParentName" // Ensure this matches the key in the API data
                                                            queryParams={{
                                                                formName: 'FrmBusinessPartner',
                                                                fieldValue: '', // Optional initial value
                                                            }}
                                                            placeholder="Select Parent Name"
                                                            // onSelect={(value) => setBpParenNameValue(value)} // Update state
                                                            onSelect={handleSelect} // Update both fields on selection
                                                            value={customerODetail.parentBPName}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, parentBPName: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className="form-group">
                                                <label htmlFor="BPGroup1">BP Group 1</label>
                                                <DropDownBoxTblf5
                                                    id="BPGroup1" // Pass the id dynamically
                                                    queryParams={{
                                                        formName: 'FrmBusinessPartner',
                                                        fieldValue: '' // No value initially for BPGroup1
                                                    }}
                                                    placeholder="Select Group 1"
                                                    onSelect={handleSelect}
                                                    // onSelect={(value) => setBpGroup1Value(value)} // Update BP Group 1 value
                                                    value={customerODetail.BPGroup1}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, BPGroup1: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="BPGroup2">BP Group 2</label>
                                                <DropDownBoxTblf5
                                                    id="BPGroup2" // Pass the id dynamically
                                                    queryParams={{
                                                        formName: 'FrmBusinessPartner',
                                                        fieldValue: customerODetail.BPGroup1 // Filter BP Group 2 by BP Group 1 value
                                                    }}
                                                    placeholder="Select Group 2"
                                                    onSelect={handleSelect}
                                                    //onSelect={(value) => setBpGroup2Value(value)} // Update BP Group 2 value
                                                    value={customerODetail.BPGroup2}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, BPGroup2: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="BPGroup3">BP Group 3</label>
                                                <DropDownBoxTblf5
                                                    id="BPGroup3" // Pass the id dynamically
                                                    queryParams={{
                                                        formName: 'FrmBusinessPartner',
                                                        fieldValue: customerODetail.BPGroup2 // Filter BP Group 3 by BP Group 2 value
                                                    }}
                                                    placeholder="Select Group 3"
                                                    onSelect={handleSelect}
                                                    //onSelect={(value) => setBpGroup3Value(value)} // Update BP Group 3 value
                                                    value={customerODetail.BPGroup3}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, BPGroup3: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="BPCurrency" className="">Currency</label>
                                                <select id="BPCurrency"
                                                    className="form-select"
                                                    value={customerODetail.bpCurrency || ""}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, bpCurrency: e.target.value })}
                                                >
                                                    <option value="" disabled>
                                                        --Select--
                                                    </option>
                                                    {currencies.length > 0 ? (
                                                        currencies.map((currency, index) => (
                                                            <option key={index} value={currency.CurrencyName}>
                                                                {currency.CurrencyName}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>Loading...</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='BPBalance'>Balance</label>
                                                <input
                                                    type='number'
                                                    id='BPBalance'
                                                    className='form-control'
                                                    placeholder='Enter Balance'
                                                    value={customerODetail.balance}
                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, balance: e.target.value })}
                                                />
                                            </div>
                                            <div className='row'>
                                                <div className="col-md-6 mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <div className="form-check">
                                                        <input type="checkbox"
                                                            id="Active"
                                                            className="form-check-input"
                                                            //defaultChecked
                                                            checked={customerODetail.active === 'Y'}
                                                            onChange={(e) =>
                                                                setCustomerODetail({
                                                                    ...customerODetail,
                                                                    active: e.target.checked ? 'Y' : 'N',
                                                                })
                                                            }
                                                        />
                                                        <label htmlFor="Active" className="form-check-label">Active</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mt-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <div className="form-check">
                                                        <input type="checkbox"
                                                            id="Masterapproved"
                                                            className="form-check-input"
                                                            checked={customerODetail.approved === 'Y'}
                                                            onChange={(e) =>
                                                                setCustomerODetail({
                                                                    ...customerODetail,
                                                                    approved: e.target.checked ? 'Y' : 'N',
                                                                })
                                                            }
                                                        />
                                                        <label htmlFor="Masterapproved" className="form-check-label">Master Approved</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Panels */}
                                <div className='container-OtherDetails'>
                                    <BusinessPartnerPanel title='Address'>
                                        {/* Add Address Button */}
                                        <button
                                            className='btn btn-primary panel-button'
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent form submission
                                                setShowAddressModal(true); // Show the modal
                                            }}
                                        >
                                            <i className='fa-solid fa-plus'></i><span>Address</span>
                                        </button>

                                        {/* Address Grid */}
                                        {addresses.length > 0 && (
                                            <div className="table-wrapper">
                                                <table className='table mt-3'>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>location</th>
                                                            <th style={{ display: 'none' }}>Country</th>
                                                            <th style={{ display: 'none' }}>City</th>
                                                            <th style={{ display: 'none' }}>State</th>
                                                            <th style={{ display: 'none' }}>Zip</th>
                                                            <th style={{ display: 'none' }}>Address1</th>
                                                            <th style={{ display: 'none' }}>address2</th>
                                                            <th style={{ display: 'none' }}>Address3</th>
                                                            <th style={{ display: 'none' }}>Phone1</th>
                                                            <th style={{ display: 'none' }}>Phone2</th>
                                                            <th style={{ display: 'none' }}>Mobile</th>
                                                            <th style={{ display: 'none' }}>EmailID</th>
                                                            <th style={{ display: 'none' }}>Website</th>
                                                            <th style={{ display: 'none' }}>Fax</th>
                                                            <th style={{ display: 'none' }}>GST</th>
                                                            <th style={{ display: 'none' }}>GST Num</th>
                                                            <th style={{ display: 'none' }}>TAN No</th>
                                                            <th>SEZ</th>
                                                            <th>Composit GST</th>
                                                            <th>Active</th>
                                                            <th>Address Approved</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {addresses.map((address, index) => (
                                                            <tr key={index}>
                                                                <td>{address.lineID}</td>
                                                                <td>{address.location}</td>
                                                                <td style={{ display: 'none' }}>{address.country}</td>
                                                                <td style={{ display: 'none' }}>{address.city}</td>
                                                                <td style={{ display: 'none' }}>{address.state}</td>
                                                                <td style={{ display: 'none' }}>{address.zip}</td>
                                                                <td style={{ display: 'none' }}>{address.address1}</td>
                                                                <td style={{ display: 'none' }}>{address.address2}</td>
                                                                <td style={{ display: 'none' }}>{address.address3}</td>
                                                                <td style={{ display: 'none' }}>{address.phone1}</td>
                                                                <td style={{ display: 'none' }}>{address.phone2}</td>
                                                                <td style={{ display: 'none' }}>{address.mobile}</td>
                                                                <td style={{ display: 'none' }}>{address.email}</td>
                                                                <td style={{ display: 'none' }}>{address.website}</td>
                                                                <td style={{ display: 'none' }}>{address.fax}</td>
                                                                <td style={{ display: 'none' }}>{address.gstSelect}</td>
                                                                <td style={{ display: 'none' }}>{address.gstNum}</td>
                                                                <td style={{ display: 'none' }}>{address.tanNum}</td>
                                                                <td>{address.sezChecked}</td>
                                                                <td>{address.compositGstChecked}</td>
                                                                <td>{address.activeChecked}</td>
                                                                <td>{address.addressApprChecked}</td>
                                                                <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-warning btn-sm mx-1 mt-1"
                                                                        onClick={() => hanldeAddressEdit(index)}
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm mx-1 mt-1"
                                                                        onClick={() => hanldeAddressDelete(index)}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </BusinessPartnerPanel>
                                    <BusinessPartnerPanel title='Tax Information'>
                                        <div className='row'>
                                            <div className='col-md-6 col-sm-6'>
                                                {/* Tax Information */}
                                                <strong><small><p>Tax Details<span className='text-danger'>*</span></p></small></strong>
                                                <div className='row'>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="vatNo"
                                                                className="col-md-3">VAT No.</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="vatNo"
                                                                    placeholder='Enter VAT No'
                                                                    value={customerODetail.vat}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, vat: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="tanNo"
                                                                className="col-md-3">TAN No.</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="tanNo"
                                                                    placeholder='Enter TAN No'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="tmcoNo"
                                                                className="col-md-3">TMCO No.</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="tmcoNo"
                                                                    placeholder='Enter TMCO No'
                                                                    value={customerODetail.tmco}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, tmco: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="cstNo"
                                                                className="col-md-3">CST No.</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="cstNo"
                                                                    placeholder='Enter CST No'
                                                                    value={customerODetail.cst}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, cst: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="panNo"
                                                                className="col-md-3">PAN No.</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="panNo"
                                                                    placeholder='Enter PAN No'
                                                                    value={customerODetail.pan}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, pan: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-2 row">
                                                            <label
                                                                htmlFor="esi"
                                                                className="col-md-3">ESI</label>
                                                            <div className="col-md-9">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="esi"
                                                                    placeholder='Enter ESI No'
                                                                    value={customerODetail.esi}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, esi: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="dcRegNo"
                                                        className="col-md-2">DC Reg No.</label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="dcRegNo"
                                                            placeholder='Enter DC Reg No'
                                                            value={customerODetail.dcRegNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, dcRegNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="bioCardNo"
                                                        className="col-md-2">Bio Card No.</label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="bioCardNo"
                                                            placeholder=''
                                                            value={customerODetail.bioCardNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, bioCardNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="vendorCode"
                                                        className="col-md-2">Vendor Code</label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="vendorCode"
                                                            placeholder=''
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-6'>
                                                {/* Exice Information */}
                                                <strong><small><p>Exicise Info<span className='text-danger'>*</span></p></small></strong>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="eccNo"
                                                        className="col-md-3">ECC No</label>
                                                    <div className="col-md-9">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="eccNo"
                                                            placeholder=''
                                                            value={customerODetail.eccNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, eccNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="ceRegistration"
                                                        className="col-md-3">CE Registration</label>
                                                    <div className="col-md-9">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="ceRegistration"
                                                            placeholder=''
                                                            value={customerODetail.ceRegistrationNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, ceRegistrationNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="ceRange"
                                                        className="col-md-3">CE Range</label>
                                                    <div className="col-md-9">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="ceRange"
                                                            placeholder=''
                                                            value={customerODetail.ceRange}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, ceRange: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="ceCommisionorate"
                                                        className="col-md-3">CE Commisionorate</label>
                                                    <div className="col-md-9">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="ceCommisionorate"
                                                            placeholder=''
                                                            value={customerODetail.ceCommissionorate}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, ceCommissionorate: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="serviceTaxNo"
                                                        className="col-md-3">Service Tax No</label>
                                                    <div className="col-md-9">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="serviceTaxNo"
                                                            placeholder=''
                                                            value={customerODetail.serviceTaxNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, serviceTaxNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-md-6 col-sm-6'>
                                                <strong><small><p>MSME Registration<span className='text-danger'>*</span></p></small></strong>
                                                <div className='mb-2 row'>
                                                    <label className="d-block col-md-2">Category</label>
                                                    <div className="col-md-10">
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="msmeCategory"
                                                                id="rdoMsmeCategory1"
                                                                value="none"
                                                                checked={customerODetail.msmeCategory === 'none'}
                                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor="rdoMsmeCategory1">None</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="msmeCategory"
                                                                id="rdoMsmeCategory2"
                                                                value="micro"
                                                                checked={customerODetail.msmeCategory === 'micro'}
                                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor="rdoMsmeCategory2">Micro</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="msmeCategory"
                                                                id="rdoMsmeCategory3"
                                                                value="small"
                                                                checked={customerODetail.msmeCategory === 'small'}
                                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor="rdoMsmeCategory3">Small</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="msmeCategory"
                                                                id="rdoMsmeCategory4"
                                                                value="medium"
                                                                checked={customerODetail.msmeCategory === 'medium'}
                                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                            />
                                                            <label className="form-check-label" htmlFor="rdoMsmeCategory4">Medium</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-2 row">
                                                    <label
                                                        htmlFor="regNo"
                                                        className="col-md-2">Reg No.</label>
                                                    <div className="col-md-10">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            id="regNo"
                                                            placeholder=''
                                                            value={customerODetail.msmeRegNo}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, msmeRegNo: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className='mb-2 row'>
                                                            <label
                                                                htmlFor="regNo"
                                                                className="col-md-4">Date of Reg.</label>
                                                            <div className="col-md-8">
                                                                <input style={{ fontSize: '12px' }}
                                                                    className="form-control"
                                                                    type="date"
                                                                    id="regNo"
                                                                    placeholder=''
                                                                    value={customerODetail.msmeRegDate}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, msmeRegDate: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className='mb-2 row'>
                                                            <label
                                                                htmlFor="regNo"
                                                                className="col-md-4">Valid Upto</label>
                                                            <div className="col-md-8">
                                                                <input style={{ fontSize: '12px' }}
                                                                    className="form-control"
                                                                    type="date"
                                                                    id="validUpto"
                                                                    placeholder=''
                                                                    value={customerODetail.msmeValidUpto}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, msmeValidUpto: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 col-sm-6'>
                                                <strong><small><p>Other Info<span className='text-danger'>*</span></p></small></strong>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <div className='mb-2 row'>
                                                            <label
                                                                htmlFor="regNo"
                                                                className="col-md-3">Payment Mode</label>
                                                            <div className="col-md-9">
                                                                <select style={{ height: '35px' }}
                                                                    className='form-select' id='payementSelect'
                                                                    value={customerODetail.paymentMode || ''}
                                                                    onChange={(e) => setCustomerODetail({
                                                                        ...customerODetail, paymentMode: e.target.value
                                                                    })}
                                                                >
                                                                    <option defaultValue='--Select--' value='' disabled >--Select--</option>
                                                                    <option value='Cash'>Cash</option>
                                                                    <option value='Cheque'>Cheque</option>
                                                                    <option value='RTGS'>RTGS</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='mb-2 row'>
                                                            <label
                                                                htmlFor="paymentTerm"
                                                                className="col-md-3 col-sm-3">Payment Term</label>
                                                            <div className="col-md-6 col-sm-6">
                                                                <input style={{ fontSize: '12px' }}
                                                                    className="form-control"
                                                                    type='number'
                                                                    id="paymentTerm"
                                                                    value={customerODetail.paymentTerm}
                                                                    onChange={(e) => setCustomerODetail({ ...customerODetail, paymentTerm: e.target.value })}
                                                                    placeholder=''
                                                                />
                                                            </div>
                                                            <span htmlFor='paymentTerm' className='col-md-3 col-sm-3'><small>Days</small></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-2'>
                                                    <label
                                                        htmlFor="creditLimit"
                                                        className="col-md-2 col-sm-3">Credit Limit</label>
                                                    <div className="col-md-4 col-sm-9">
                                                        <input style={{ fontSize: '12px' }}
                                                            className="form-control"
                                                            type='number'
                                                            id="creditLimit"
                                                            value={customerODetail.creditLimit}
                                                            onChange={(e) => setCustomerODetail({ ...customerODetail, creditLimit: e.target.value })}
                                                            placeholder=''
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className="form-check mt-1">
                                                            <input
                                                                type="checkbox"
                                                                id="glCess"
                                                                className="form-check-input"
                                                                checked={customerODetail.glCess === 'Y'}
                                                                onChange={(e) =>
                                                                    setCustomerODetail({
                                                                        ...customerODetail,
                                                                        glCess: e.target.checked ? 'Y' : 'N'
                                                                    })
                                                                }
                                                            />
                                                            <label htmlFor="glCess" className="form-check-label">GL Cess
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6 col-sm-6'>
                                                        <div className="form-check mt-1">
                                                            <input
                                                                type="checkbox"
                                                                id="aastga"
                                                                className="form-check-input"
                                                                checked={customerODetail.aastga === 'Y'}
                                                                onChange={(e) =>
                                                                    setCustomerODetail({
                                                                        ...customerODetail,
                                                                        aastga: e.target.checked ? 'Y' : 'N'
                                                                    })
                                                                }
                                                            />
                                                            <label htmlFor="aastga" className="form-check-label">AASTGA
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </BusinessPartnerPanel>
                                    <BusinessPartnerPanel title='Accounting'>
                                        {/* Add Accounting Button */}
                                        <button
                                            className='btn btn-primary panel-button'
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent form submission
                                                setShowAccountModal(true);
                                            }}
                                        >
                                            <i className='fa-solid fa-plus'></i><span>Account</span>
                                        </button>
                                        {/* Accounts Grid */}
                                        {accounts.length > 0 && (
                                            <div className="table-wrapper">
                                                <table className='table mt-3'>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>GL Code</th>
                                                            <th>GL Name</th>
                                                            <th>Balance</th>
                                                            <th>MGroup 1</th>
                                                            <th>MGroup 2</th>
                                                            <th>MGroup 3</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {accounts.map((Account, index) => (
                                                            <tr key={index}>
                                                                <td>{Account.lineID}</td>
                                                                <td>{Account.glCode}</td>
                                                                <td>{Account.glName}</td>
                                                                <td>{Account.balance}</td>
                                                                <td>{Account.mGroup1}</td>
                                                                <td>{Account.mGroup2}</td>
                                                                <td>{Account.mGroup3}</td>
                                                                <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-warning btn-sm mx-1 mt-1"
                                                                        onClick={() => handleAccountEdit(index)}
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm mx-1 mt-1"
                                                                        onClick={() => handleAccountDelete(index)}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </BusinessPartnerPanel>
                                    <BusinessPartnerPanel title='Contact Persons'>
                                        {/* Add Contact Person Button */}
                                        <button
                                            className='btn btn-primary panel-button'
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent form submission
                                                setShowContactModal(true); // Show the modal
                                            }}
                                        >
                                            <i className='fa-solid fa-plus'></i><span>Contact</span>
                                        </button>
                                        {/* Contact Grid */}
                                        {contacts.length > 0 && (
                                            <div className="table-wrapper">
                                                <table className='table mt-3'>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Department</th>
                                                            <th>Designation</th>
                                                            <th>Phone1</th>
                                                            <th>Phone2</th>
                                                            <th>Mobile</th>
                                                            <th>Fax</th>
                                                            <th>Email</th>
                                                            <th>Website</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {contacts.map((Contact, index) => (
                                                            <tr key={index}>
                                                                <td>{Contact.lineID}</td>
                                                                <td>{Contact.name}</td>
                                                                <td>{Contact.department}</td>
                                                                <td>{Contact.designation}</td>
                                                                <td>{Contact.phoneNo1}</td>
                                                                <td>{Contact.phoneNo2}</td>
                                                                <td>{Contact.mobile}</td>
                                                                <td>{Contact.fax}</td>
                                                                <td>{Contact.email}</td>
                                                                <td>{Contact.website}</td>
                                                                <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-warning btn-sm mx-1 mt-1"
                                                                        onClick={() => handleContactEdit(index)}
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm mx-1 mt-1"
                                                                        onClick={() => handleContactDelete(index)}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </BusinessPartnerPanel>
                                    <BusinessPartnerPanel title='Banking'>
                                        {/* Add Banking Button */}
                                        <button
                                            className='btn btn-primary panel-button'
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent form submission
                                                setShowBankingModal(true); // Show the modal
                                            }}
                                        >
                                            <i className='fa-solid fa-plus'></i><span>Banking</span>
                                        </button>
                                        {/* Banking Grid */}
                                        {bankings.length > 0 && (
                                            <div className="table-wrapper">
                                                <table className='table mt-3'>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Bank Name</th>
                                                            <th>Account No.</th>
                                                            <th>Brance</th>
                                                            <th>IFSC</th>
                                                            <th>Account Type</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bankings.map((Bank, index) => (
                                                            <tr key={index}>
                                                                <td>{Bank.lineID}</td>
                                                                <td>{Bank.bankName}</td>
                                                                <td>{Bank.accountNo}</td>
                                                                <td>{Bank.branch}</td>
                                                                <td>{Bank.ifsc}</td>
                                                                <td>{Bank.accountType}</td>
                                                                <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-warning btn-sm mx-1 mt-1"
                                                                        onClick={() => handleBankingEdit(index)}
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm mx-1 mt-1"
                                                                        onClick={() => handleBankingDelete(index)}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </BusinessPartnerPanel>
                                    {/* <BusinessPartnerPanel title='TDS'>
                                        <h2>Tax Information Tab Content</h2>
                                        <p>Details about tax information can go here.</p>
                                    </BusinessPartnerPanel> */}
                                    <BusinessPartnerPanel title='Attachments'>
                                        <h6>Add Attachment(s)<span style={{ color: 'red' }}>*</span></h6>
                                        <div className="mb-4">
                                            {/* <label htmlFor="mulAttachment" className="form-label">Attachment (Multiple)</label> */}
                                            <input className="form-control" type="file" id="mulAttachment" multiple></input>
                                        </div>
                                    </BusinessPartnerPanel>
                                </div>
                                <div className='form-action-button mt-2'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        id='btnSave'
                                    >
                                        {isEditMode ? 'Update' : 'Save'}
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
                        <React.Suspense fallback={<div>Loading...</div>}>
                            {isLoading ? (
                                <div>Loading data...</div>
                            ) : (
                                <div className="view-tab">
                                    <GridviewTblf5
                                        formName="FrmBusinessPartner"
                                        fieldName="BtnFind"
                                        onSelectRow={handleSelectRow}
                                        setActiveTab={handleSetActiveTab}
                                    />
                                </div>
                            )}
                        </React.Suspense>
                    )}
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form className='modal-form'>
                            <div className='modal-header'>
                                <h6>Add address<span style={{ color: 'red' }}>*</span></h6>
                                <button type='button' className='close-button' onClick={() => {
                                    setShowAddressModal(false);
                                    setModalAddress({
                                        lineID: null,
                                        location: '', country: '', city: '', state: '', zip: '',
                                        address1: '', address2: '', address3: '', phone1: '', phone2: '', mobile: '',
                                        fax: '', email: '', website: '', gstSelect: '', gstNum: '', tanNum: '',
                                        sezChecked: 'N', compositGstChecked: 'N', activeChecked: 'N', addressApprChecked: 'N'
                                    });
                                    setIsEditing(false); // Exit editing mode
                                    setEditIndex(null); // Clear index
                                }}

                                    aria-label='close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='location'>Locaton</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="form-control"
                                    placeholder='Enter Customer Location'
                                    value={modalAddress.location}
                                    onChange={(e) => setModalAddress({ ...modalAddress, location: e.target.value })}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    {/* Country Dropdown */}
                                    <div className="form-group">
                                        <label htmlFor="country" className="">Country</label>
                                        <select
                                            id="country"
                                            className="form-select"
                                            value={modalAddress.country} // Bind selected country
                                            onChange={(e) => handleCountryChange(e.target.value)} // Update on change
                                        >
                                            {/* Default option */}
                                            <option value="">--Select--</option>
                                            {countries.length > 0 ? (
                                                countries.map((country, index) => (
                                                    <option key={index} value={country.CountryName}>
                                                        {country.CountryName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Loading...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            className="form-control"
                                            placeholder='Enter City'
                                            value={modalAddress.city}
                                            onChange={(e) => setModalAddress({ ...modalAddress, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    {/* State Dropdown */}
                                    <div className="form-group">
                                        <label htmlFor="state" className="">State</label>
                                        <select
                                            id="state"
                                            className="form-select"
                                            value={modalAddress.state} // Bind selected state
                                            onChange={(e) => setModalAddress((prev) => ({ ...prev, state: e.target.value }))} // Update state on change
                                        >
                                            {/* Default option */}
                                            <option value="">--Select--</option>
                                            {states.length > 0 ? (
                                                states.map((state, index) => (
                                                    <option key={index} value={state.StateName}>
                                                        {state.StateName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Loading...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="zip">Zip</label>
                                        <input
                                            type="number"
                                            id="zip"
                                            className="form-control"
                                            placeholder='Enter Pin Code'
                                            value={modalAddress.zip}
                                            onChange={(e) => setModalAddress({ ...modalAddress, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="address1">Address1</label>
                                    <textarea
                                        type="text"
                                        id="address1"
                                        className="form-control"
                                        placeholder='Enter Address 1'
                                        value={modalAddress.address1}
                                        onChange={(e) => setModalAddress({ ...modalAddress, address1: e.target.value })}
                                    />
                                    <label htmlFor="address2">Address2</label>
                                    <textarea
                                        type="text"
                                        id="address2"
                                        className="form-control"
                                        placeholder='Enter Address 2'
                                        value={modalAddress.address2}
                                        onChange={(e) => setModalAddress({ ...modalAddress, address2: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="address3">Address3</label>
                                    <textarea
                                        type="text"
                                        id="address3"
                                        className="form-control"
                                        placeholder='Enter Address 3'
                                        value={modalAddress.address3}
                                        onChange={(e) => setModalAddress({ ...modalAddress, address3: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="phone1">Phone 1</label>
                                    <input
                                        type='text'
                                        id="phone1"
                                        maxLength={10}
                                        className="form-control"
                                        placeholder='Enter Phone 1'
                                        value={modalAddress.phone1}
                                        onChange={(e) => setModalAddress({ ...modalAddress, phone1: e.target.value })}
                                    />
                                    <label htmlFor="phone2">Phone 2</label>
                                    <input
                                        type="text"
                                        id="phone2"
                                        maxLength={10}
                                        className="form-control"
                                        placeholder='Enter Phone 2'
                                        value={modalAddress.phone2}
                                        onChange={(e) => setModalAddress({ ...modalAddress, phone2: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="mobile">Mobile</label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        maxLength={10}
                                        className="form-control"
                                        placeholder='Enter Mobile'
                                        value={modalAddress.mobile}
                                        onChange={(e) => setModalAddress({ ...modalAddress, mobile: e.target.value })}
                                    />
                                    <label htmlFor="fax">Fax</label>
                                    <input
                                        type="text"
                                        id="fax"
                                        className="form-control"
                                        placeholder='Enter Fax'
                                        value={modalAddress.fax}
                                        onChange={(e) => setModalAddress({ ...modalAddress, fax: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder='Enter Email'
                                        value={modalAddress.email}
                                        onChange={(e) => setModalAddress({ ...modalAddress, email: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="website">Website</label>
                                    <input
                                        type="text"
                                        id="website"
                                        className="form-control"
                                        placeholder='Enter Website'
                                        value={modalAddress.website}
                                        onChange={(e) => setModalAddress({ ...modalAddress, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="website">GST</label>
                                    <select
                                        id="gstSelect"
                                        className="form-select"
                                        value={modalAddress.gstSelect} // Bind the current value to the state
                                        onChange={(e) => setModalAddress({ ...modalAddress, gstSelect: e.target.value })} // Update state on change
                                    >
                                        <option value="Y">Y</option> {/* Ensure each option has a value attribute */}
                                        <option value="N">N</option>
                                    </select>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="gstNumber">GST Num</label>
                                    <input
                                        type="text"
                                        id="gstNumber"
                                        className="form-control"
                                        placeholder='Enter GST Num (if applicable)'
                                        value={modalAddress.gstNum}
                                        onChange={(e) => setModalAddress({ ...modalAddress, gstNum: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="tanNum">TAN Num</label>
                                    <input
                                        type="text"
                                        id="tanNum"
                                        className="form-control"
                                        placeholder='Enter Tan No'
                                        value={modalAddress.tanNum}
                                        onChange={(e) => setModalAddress({ ...modalAddress, tanNum: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='row'>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className="form-check mt-4">
                                                <input
                                                    type="checkbox"
                                                    id="sez"
                                                    className="form-check-input"
                                                    checked={modalAddress.sezChecked === "Y"}
                                                    onChange={(e) =>
                                                        setModalAddress({
                                                            ...modalAddress,
                                                            sezChecked: e.target.checked ? "Y" : "N",
                                                        })
                                                    }
                                                />
                                                <label htmlFor="sez" className="form-check-label">SEZ
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className="form-check mt-4">
                                                <input
                                                    type="checkbox"
                                                    id="compositGst"
                                                    className="form-check-input"
                                                    checked={modalAddress.compositGstChecked === "Y"}
                                                    onChange={(e) =>
                                                        setModalAddress({
                                                            ...modalAddress,
                                                            compositGstChecked: e.target.checked ? "Y" : "N",
                                                        })
                                                    }
                                                />
                                                <label htmlFor="compositGst" className="form-check-label">Composit GST
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='row'>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className="form-check mt-1">
                                                <input
                                                    type="checkbox"
                                                    id="activeAddress"
                                                    className="form-check-input"
                                                    checked={modalAddress.activeChecked === "Y"}
                                                    onChange={(e) =>
                                                        setModalAddress({
                                                            ...modalAddress,
                                                            activeChecked: e.target.checked ? "Y" : "N",
                                                        })
                                                    }
                                                />
                                                <label htmlFor="activeAddress" className="form-check-label">Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-6 col-sm-6'>
                                            <div className="form-check mt-1">
                                                <input
                                                    type="checkbox"
                                                    id="approvedAddress"
                                                    className="form-check-input"
                                                    checked={modalAddress.addressApprChecked === "Y"}
                                                    onChange={(e) =>
                                                        setModalAddress({
                                                            ...modalAddress,
                                                            addressApprChecked: e.target.checked ? "Y" : "N",
                                                        })
                                                    }
                                                />
                                                <label htmlFor="approvedAddress" className="form-check-label">Approved
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className="modal-actions mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (isEditing) {
                                                    // Update the existing row
                                                    const updatedAddresses = addresses.map((address, i) =>
                                                        i === editIndex
                                                            ? { ...modalAddress, lineID: address.lineID } // Keep the original lineID
                                                            : address
                                                    );
                                                    setAddresses(updatedAddresses);
                                                } else {
                                                    // Add a new row
                                                    const newLineID = addresses.length > 0
                                                        ? Math.max(...addresses.map(addr => addr.lineID || 0)) + 1
                                                        : 1;
                                                    setAddresses([...addresses, { ...modalAddress, lineID: newLineID }]);
                                                }
                                                // Reset modal state
                                                setModalAddress({
                                                    lineID: null,
                                                    location: '', country: '', city: '', state: '', zip: '',
                                                    address1: '', address2: '', address3: '', phone1: '', phone2: '', mobile: '',
                                                    fax: '', email: '', website: '', gstSelect: 'N', gstNum: '', tanNum: '',
                                                    sezChecked: 'N', compositGstChecked: 'N', activeChecked: 'N', addressApprChecked: 'N'
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                                setShowAddressModal(false); // Close the modal
                                            }}
                                        >
                                            {isEditing ? "Update" : "Add"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowAddressModal(false);
                                                setModalAddress({
                                                    lineID: null,
                                                    location: '', country: '', city: '', state: '', zip: '',
                                                    address1: '', address2: '', address3: '', phone1: '', phone2: '', mobile: '',
                                                    fax: '', email: '', website: '', gstSelect: 'Y', gstNum: '', tanNum: '',
                                                    sezChecked: 'N', compositGstChecked: 'N', activeChecked: 'N', addressApprChecked: 'N'
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Account Modal */}
            {showAccountModal && (
                <div className="modal-overlay">
                    <div className="modal-content">

                        <form className='modal-form'>
                            <div className='modal-header'>
                                <h6>Add Accounts<span style={{ color: 'red' }}>*</span></h6>
                                <button type='button' className='close-button' onClick={() => {
                                    setShowAccountModal(false);
                                    setModalAccount({
                                        glCode: '', glName: '', balance: '', mGroup1: '', mGroup2: '', mGroup3: ''
                                    });
                                    setIsEditing(false); // Exit editing mode
                                    setEditIndex(null); // Clear index
                                }}

                                    aria-label='close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='form-group'>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='glCodeAccount'>GL Code</label>
                                        <input
                                            type="text"
                                            id="glCodeAccount"
                                            className="form-control"
                                            value={modalAccount.glCode}
                                            onChange={(e) => setModalAccount({ ...modalAccount, glCode: e.target.value })}
                                        />
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='glNameAccount'>GL Name</label>
                                        <input
                                            type="text"
                                            id="glNameAccount"
                                            className="form-control"
                                            value={modalAccount.glName}
                                            onChange={(e) => setModalAccount({ ...modalAccount, glName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='balanceAccount'>Balance</label>
                                        <input
                                            type="number"
                                            id="balanceAccount"
                                            className="form-control"
                                            value={modalAccount.balance}
                                            onChange={(e) => setModalAccount({ ...modalAccount, balance: e.target.value })}
                                        />
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='mGroup1Account'>MGroup 1</label>
                                        <input
                                            type="text"
                                            id="mGroup1Account"
                                            className="form-control"
                                            value={modalAccount.mGroup1}
                                            onChange={(e) => setModalAccount({ ...modalAccount, mGroup1: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='mGroup2Account'>MGroup 2</label>
                                        <input
                                            type="text"
                                            id="mGroup2Account"
                                            className="form-control"
                                            value={modalAccount.mGroup2}
                                            onChange={(e) => setModalAccount({ ...modalAccount, mGroup2: e.target.value })}
                                        />
                                    </div>
                                    <div className='col-md-6 col-sm-6'>
                                        <label htmlFor='mGroup3Account'>MGroup 3</label>
                                        <input
                                            type="text"
                                            id="mGroup3Account"
                                            className="form-control"
                                            value={modalAccount.mGroup3}
                                            onChange={(e) => setModalAccount({ ...modalAccount, mGroup3: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className="modal-actions mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (isEditing) {
                                                    // Update the existing row
                                                    const updatedAccount = accounts.map((Account, i) =>
                                                        i === editIndex
                                                            ? { ...modalAccount, lineID: Account.lineID }
                                                            : Account
                                                    );
                                                    setAccounts(updatedAccount);
                                                } else {
                                                    // Add a new row
                                                    // setAccounts([...accounts, modalAccount]);
                                                    const newLineID = accounts.length > 0
                                                        ? Math.max(...accounts.map(acc => acc.lineID || 0)) + 1
                                                        : 1;
                                                    setAccounts([...accounts, { ...modalAccount, lineID: newLineID }]);
                                                }
                                                // Reset modal state
                                                setModalAccount({
                                                    lineID: null,
                                                    glCode: '', glName: '', balance: '', mGroup1: '', mGroup2: '', mGroup3: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                                setShowAccountModal(false); // Close the modal
                                            }}
                                        >
                                            {isEditing ? "Update" : "Add"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowAccountModal(false);
                                                setModalAccount({
                                                    lineID: null,
                                                    glCode: '', glName: '', balance: '', mGroup1: '', mGroup2: '', mGroup3: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form className='modal-form'>
                            <div className='modal-header'>
                                <h6>Add Contact<span style={{ color: 'red' }}>*</span></h6>
                                <button type='button' className='close-button' onClick={() => {
                                    setShowContactModal(false);
                                    setModalContact({
                                        lineID: null,
                                        name: '', department: '', designation: '', phoneNo1: '', phoneNo2: '', mobile: '',
                                        fax: '', email: '', website: ''
                                    });
                                    setIsEditing(false); // Exit editing mode
                                    setEditIndex(null); // Clear index
                                }}

                                    aria-label='close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='nameContact'>Name</label>
                                <input
                                    type="text"
                                    id="nameContact"
                                    className="form-control"
                                    value={modalContact.name}
                                    onChange={(e) => setModalContact({ ...modalContact, name: e.target.value })}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor='departmentContact'>Department</label>
                                    <input
                                        type="text"
                                        id="departmentContact"
                                        className="form-control"
                                        value={modalContact.department}
                                        onChange={(e) => setModalContact({ ...modalContact, department: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor='designationContact'>Designation</label>
                                    <input
                                        type="text"
                                        id="designationContact"
                                        className="form-control"
                                        value={modalContact.designation}
                                        onChange={(e) => setModalContact({ ...modalContact, designation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="phone1Contact">Phone 1</label>
                                    <input
                                        type='text'
                                        id="phone1Contact"
                                        maxLength={10}
                                        className="form-control"
                                        value={modalContact.phoneNo1}
                                        onChange={(e) => setModalContact({ ...modalContact, phoneNo1: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="phone2Contact">Phone 2</label>
                                    <input
                                        type='text'
                                        id="phone2Contact"
                                        maxLength={10}
                                        className="form-control"
                                        value={modalContact.phoneNo2}
                                        onChange={(e) => setModalContact({ ...modalContact, phoneNo2: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="mobileContact">Mobile</label>
                                    <input
                                        type='text'
                                        id="mobileContact"
                                        maxLength={10}
                                        className="form-control"
                                        value={modalContact.mobile}
                                        onChange={(e) => setModalContact({ ...modalContact, mobile: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="faxContact">Fax</label>
                                    <input
                                        type='text'
                                        id="faxContact"
                                        maxLength={10}
                                        className="form-control"
                                        value={modalContact.fax}
                                        onChange={(e) => setModalContact({ ...modalContact, fax: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="emailContact">Email</label>
                                    <input
                                        type='email'
                                        id="emailContact"
                                        className="form-control"
                                        value={modalContact.email}
                                        onChange={(e) => setModalContact({ ...modalContact, email: e.target.value })}
                                    />
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <label htmlFor="websiteContact">Website</label>
                                    <input
                                        type='text'
                                        id="websiteContact"
                                        className="form-control"
                                        value={modalContact.website}
                                        onChange={(e) => setModalContact({ ...modalContact, website: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className="modal-actions mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (isEditing) {
                                                    // Update the existing row
                                                    const updatedContact = contacts.map((Contact, i) =>
                                                        i === editIndex
                                                            ? { ...modalContact, lineID: Contact.lineID }
                                                            : Contact
                                                    );
                                                    setContacts(updatedContact);
                                                } else {
                                                    // Add a new row
                                                    //setContacts([...contacts, modalContact]);
                                                    const newLineID = contacts.length > 0
                                                        ? Math.max(...contacts.map(cont => cont.lineID || 0)) + 1
                                                        : 1;
                                                    setContacts([...contacts, { ...modalContact, lineID: newLineID }]);
                                                }
                                                // Reset modal state
                                                setModalContact({
                                                    lineID: null,
                                                    name: '', department: '', designation: '', phoneNo1: '', phoneNo2: '', mobile: '',
                                                    fax: '', email: '', website: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                                setShowContactModal(false); // Close the modal
                                            }}
                                        >
                                            {isEditing ? "Update" : "Add"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowContactModal(false);
                                                setModalContact({
                                                    lineID: null,
                                                    name: '', department: '', designation: '', phoneNo1: '', phoneNo2: '', mobile: '',
                                                    fax: '', email: '', website: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Banking Modal */}
            {showBankingModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form className='modal-form'>
                            <div className='modal-header'>
                                <h6>Add Bank<span style={{ color: 'red' }}>*</span></h6>
                                <button type='button' className='close-button' onClick={() => {
                                    setShowBankingModal(false);
                                    setModalBanking({
                                        lineID: '',
                                        bankName: '',
                                        accountNo: '',
                                        branch: '',
                                        ifsc: '',
                                        accountType: ''
                                    });
                                    setIsEditing(false); // Exit editing mode
                                    setEditIndex(null); // Clear index
                                }}

                                    aria-label='close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='nameBank'>Bank Name</label>
                                <input
                                    type="text"
                                    id="nameBank"
                                    className="form-control"
                                    value={modalBanking.bankName}
                                    onChange={(e) => setModalBanking({ ...modalBanking, bankName: e.target.value })}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='form-group'>
                                        <label htmlFor='accountNoBank'>Account No.</label>
                                        <input
                                            type="number"
                                            id="accountNoBank"
                                            className="form-control"
                                            value={modalBanking.accountNo}
                                            onChange={(e) => setModalBanking({ ...modalBanking, accountNo: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='form-group'>
                                        <label htmlFor='branchBank'>Branch</label>
                                        <input
                                            type="text"
                                            id="branchBank"
                                            className="form-control"
                                            value={modalBanking.branch}
                                            onChange={(e) => setModalBanking({ ...modalBanking, branch: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='form-group'>
                                        <label htmlFor='branchBank'>IFSC</label>
                                        <input
                                            type="text"
                                            id="branchBank"
                                            className="form-control"
                                            value={modalBanking.ifsc}
                                            onChange={(e) => setModalBanking({ ...modalBanking, ifsc: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className='form-group'>
                                        <label htmlFor='accTypeBank'>Account Type</label>
                                        <input
                                            type="text"
                                            id="accTypeBank"
                                            className="form-control"
                                            value={modalBanking.accountType}
                                            onChange={(e) => setModalBanking({ ...modalBanking, accountType: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6 col-sm-6'>
                                </div>
                                <div className='col-md-6 col-sm-6'>
                                    <div className="modal-actions mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                if (isEditing) {
                                                    // Update the existing row
                                                    const updatedBanking = bankings.map((Banking, i) =>
                                                        i === editIndex
                                                            ? { ...modalAccount, lineID: Banking.lineID }
                                                            : Banking
                                                    );
                                                    setBankings(updatedBanking);
                                                } else {
                                                    // Add a new row
                                                    // setBankings([...bankings, modalBanking]);
                                                    const newLineID = bankings.length > 0
                                                        ? Math.max(...bankings.map(bank => bank.lineID || 0)) + 1
                                                        : 1;
                                                    setBankings([...bankings, { ...modalBanking, lineID: newLineID }]);
                                                }
                                                // Reset modal state
                                                setModalBanking({
                                                    lineID: null,
                                                    bankName: '',
                                                    accountNo: '',
                                                    branch: '',
                                                    ifsc: '',
                                                    accountType: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                                setShowBankingModal(false); // Close the modal
                                            }}
                                        >
                                            {isEditing ? "Update" : "Add"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowBankingModal(false);
                                                setModalBanking({
                                                    lineID: null,
                                                    bankName: '',
                                                    accountNo: '',
                                                    branch: '',
                                                    ifsc: '',
                                                    accountType: ''
                                                });
                                                setIsEditing(false); // Exit editing mode
                                                setEditIndex(null); // Clear index
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BusinessPartner;