import { React, useEffect, useState } from "react";
import '../css/pages/LoginLocationSelect.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LoginLocationSelect = () => {
    const storedUserDetails = JSON.parse(sessionStorage.getItem('user'));
    const sessionValues = {
        compCode: storedUserDetails.compCode || '',
        compName: storedUserDetails.compName || '',
    }
    const [locations, setLocation] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        compCode: sessionValues.compCode,
        compName: sessionValues.compName,
        location: '',
    });

    useEffect(() => {
        axios
            .post(`${API_BASE_URL}/api/getCompanyLoc?company=${encodeURIComponent(sessionValues.compCode)}`, {})
            .then((response) => {
                const locations = response.data;
                setLocation(locations);
            })
            .catch((error) => {
                console.error('Error fetching location:', error);
            });
    }, [sessionValues.compCode]);

    const handleNext = async (e) => {
        e.preventDefault();

        if(formData.location === ''){
            setError('Please select a location to continue!');
            return;
        }
        storedUserDetails.location = formData.location;
        sessionStorage.setItem('user', JSON.stringify(storedUserDetails));
        navigate('/Dashboard');
    };

    return (
        <div className="container-page d-flex justify-content-center">
            <div className="container-location">
                <h4>Location Selection</h4>
                {error && <div className='error'>{error}</div>}
                <form onSubmit={handleNext}>
                    <div className='form-floating form-floating-outline mb-4'>
                        <input
                            type='text'
                            className='form-control'
                            id='compCode'
                            name='compCode'
                            readOnly
                            value={formData.compCode}
                        />
                        <label htmlFor='compCode'>Company Code</label>
                    </div>
                    <div className='form-floating form-floating-outline mb-4'>
                        <input
                            type='text'
                            className='form-control'
                            id='compName'
                            name='compName'
                            readOnly
                            value={formData.compName}
                        />
                        <label htmlFor='client'>Company Name</label>
                    </div>
                    <div className='form-floating form-floating-outline mb-4'>
                        <select
                            className='form-select'
                            id='compLocation'
                            name='compLocation'
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                            <option value='' disabled >--Select--</option>
                            {locations.length > 0 ? (
                                locations.map((loc, index) => (
                                    <option key={index} value={loc.Location}>
                                        {loc.Location}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading...</option>
                            )}
                        </select>
                        <label htmlFor='compLocation'>Company Location</label>
                    </div>
                    <div className='mb-4'>
                        <button
                            className='btn btn-primary'
                            style={{ width: '100%' }}
                            type='submit'
                        >
                             <span style={{marginRight: '5px'}}>Next</span> 
                             <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginLocationSelect;