import React, { useState, useEffect, useRef } from 'react';

import HeaderTabs from "./components/header-tabs/HeaderTabs";
import Body from "./components/body/Body";

import "./JobApplications.scss";

const JobApplications = (props) => {  
  const tabs = ['Overview', 'Applied', 'Did Not Apply'];
  const [activeTabId, setActiveTabId] = useState(0);

  return (
    <div className="JobApplications">
      <HeaderTabs activeTabId={activeTabId} setActiveTabId={setActiveTabId} tabs={tabs}/>
      <Body tabs={tabs} activeTabId={activeTabId}/>
    </div>
  );
}

export default JobApplications;