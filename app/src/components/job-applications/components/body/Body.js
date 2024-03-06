import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Body.scss';

const baseApiPath = 'http://localhost:5076';

const addJobApp = (data, setSuccess) => {
  const { companyName, stackInfo, additionalInfo, reason } = data;

  axios.post(
    `${baseApiPath}/add-job-app`,
    {
      companyName,
      source: '', // this is usually LinkedIn
      jobInfo: additionalInfo,
      techStack: stackInfo,
      whyNotApply: reason,
      status: reason ? '' : 'applied',
    }
  )
  .then((res) => {
    if (res.status === 201) {
      setSuccess(true);
    } else {
      alert('Failed to save job application');
    }
  })
  .catch((err) => {
    alert('Failed to save job application');
    console.error(err);
  });
}

// https://stackoverflow.com/a/4929629/2710227
const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  
  return mm + '/' + dd + '/' + yyyy;
}

const overview = () => (
  <div className="Body__overview">

  </div>
);

const applyForm = (saveData, setSuccess) => (
  <div className="Body__apply-form">
    <p>Today is {getDate()}</p>
    <input type="text" placeholder="company name" id="company-name"/>
    <input type="text" placeholder="stack info" id="stack-info"/>
    <textarea placeholder="additional info" id="additional-info"/>
    <button type="button" onClick={() => saveData(true, setSuccess)}>Save</button>
  </div>
);

const didNotApplyForm = (saveData, setSuccess) => (
  <div className="Body__apply-form">
    <p>Today is {getDate()}</p>
    <input type="text" placeholder="company name" id="company-name"/>
    <input type="text" placeholder="reason" id="reason"/>
    <button type="button" onClick={() => saveData(false, setSuccess)}>Save</button>
  </div>
);

const saveData = (applied, setSuccess) => {
  const data = {
    companyName: document.getElementById('company-name').value,
    source: '', // this is usually LinkedIn
    additionalInfo: applied ? document.getElementById('additional-info').value : '',
    stackInfo: applied ? document.getElementById('stack-info').value : '',
    whyNotApply: applied ? '' : document.getElementById('reason').value,
    status: applied ? 'applied' : '',
  };

  addJobApp(data, setSuccess);
}

const clearFields = () => {
  const companyNameField = document.getElementById('company-name');
  const stackInfoField = document.getElementById('stack-info');
  const reasonField = document.getElementById('reason');
  const additionalInfoField = document.getElementById('additional-info');

  if (companyNameField) companyNameField.value = '';
  if (stackInfoField) stackInfoField.value = '';
  if (reasonField) reasonField.value = '';
  if (additionalInfoField) additionalInfoField.value = '';
}

const getStats = (setStats) => {
  axios.get(
    `${baseApiPath}/stats`,
  )
  .then((res) => {
    if (res.status === 200) {
      console.log(res);
      console.log(res.data.data);
      Object.keys(res.data.data.appDateCount).forEach(appDate => console.log(appDate));
      setStats(res.data.data);
    } else {
      alert('Failed to get stats');
    }
  })
  .catch((err) => {
    alert('Error occurred getting stats');
    console.error(err);
  });
}

const Body = (props) => {
  const { activeTabId, tabs } = props;
  const activeTab = tabs[activeTabId];

  const [success, setSuccess] = useState(false); // used to show green animation toast thing
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        clearFields();
      }, 1400);
    }
  }, [success]);

  useEffect(() => {
    getStats(setStats);
  }, []);

  return (
    <div className="Body">
      {success && <div className="Body__toast slide-down-fade-out">Added!</div>}
      {activeTab === 'Overview' && overview()}
      {activeTab === 'Applied' && applyForm(saveData, setSuccess)}
      {activeTab === 'Did Not Apply' && didNotApplyForm(saveData, setSuccess)}
    </div>
  );
}

export default Body;