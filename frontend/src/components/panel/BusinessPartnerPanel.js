import React, { useState } from 'react';
import '../css/panel/BusinessPartnerPanel.css';

const BusinessPartnerPanel = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='panel'>
            <div className='panel-header' onClick={togglePanel}>
                {title}
                <span className='panel-icon'>
                    <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
                </span>
            </div>
            {isExpanded && <div className='panel-content'>{children}</div>}
        </div>
    );
};

export default BusinessPartnerPanel;