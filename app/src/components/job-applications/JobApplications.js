import React, { useState, useEffect, useRef } from 'react';

import HeaderTabs from "./components/header-tabs/HeaderTabs";
import Body from "./components/body/Body";

import "./JobApplications.scss";

const JobApplications = (props) => {  
  const [activeTabId, setActiveTabId] = useState(0);

  return (
    <div className="JobApplications">
      <HeaderTabs activeTabId={activeTabId} setActiveTabId={setActiveTabId}/>
      <Body/>
    </div>
  );
}

export default JobApplications;