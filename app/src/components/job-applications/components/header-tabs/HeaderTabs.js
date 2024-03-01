import React, { useState, useEffect, useRef } from 'react';

import './HeaderTabs.scss';

const HeaderTabs = (props) => {
  const tabs = ['Overview', 'Applied', 'Did Not Apply'];

  const [activeTabId, setActiveTabId] = useState(0);

  return (
    <div className="HeaderTabs">
      {tabs.map((tab, tabId) => (
        <div className={`HeaderTabs__tab ${activeTabId === tabId ? 'active' : ''}`}>
          {tabs[tabId]}
        </div>
      ))}
    </div>
  );
}

export default HeaderTabs;