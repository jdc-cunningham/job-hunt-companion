import React, { useState, useEffect } from 'react';
import axios from 'axios';
// https://stackoverflow.com/questions/67727603/error-category-is-not-a-registered-scale
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

import './Body.scss';

const baseApiPath = window.location.href.includes('local') ? 'http://localhost:5076' : 'http://192.168.1.144:5076'; // 192 is an RPi on my local network

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

const overview = (stats) => (
  <div className="Body__overview">
    {stats?.totalJobsViewed && <div className="Body__overview-data">
      <div className="Body__overview-stats">
        <span>Jobs Applied: <span className="stat">{stats.applied}</span></span>
        <span>Did not apply: <span className="stat">{stats.didNotApply}</span></span>
        <span>Total jobs viewed: <span className="stat">{stats.totalJobsViewed}</span></span>
      </div>
      <div className="Body__overview-chart">
      <Line
        data={{
          labels: Object.keys(stats.appDateCount),
          datasets: [
            {
              label: "Applied",
              data: Object.keys(stats.appDateCount).map(date => stats.appDateCount[date].applied),
              fill: true,
            },
            {
              label: "Did Not Apply",
              data: Object.keys(stats.appDateCount).map(date => stats.appDateCount[date].notApplied),
              fill: true,
            },
          ],
        }}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function(value) {
                    return `£${value}k`;
                  }
                }
              }
            ]
          }
        }}
      />
      </div>
    </div>}
    {!stats?.totalJobsViewed && <div className="Body__overview-no-data">No Data</div>}
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

// Desktop browser notifications from MDN docs
const notify = (notificationStr) => {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(notificationStr);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(notificationStr);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

const checkTime = (timer, setTimer, applied, setApplied, stats) => {
  if (timer) clearTimeout(timer);

  // every minute check if 9 PM
  setTimer(setTimeout(() => {
    const d = new Date();
    const hour = d.getHours();
    const min = d.getMinutes();
    const todaysDate = getDate();

    if ((hour >= 22 && min % 15 === 0) && !applied) { // 10 PM
      notify('Have you applied to any jobs today?');
    }

    if (todaysDate in Object.keys(stats.appDateCount)) {
      setApplied(true);
    }

    if (applied && hour < 22) {
      setApplied(false);
    }

    checkTime(timer, setTimer, applied, setApplied, stats);
  }, 60000)); // every min, but mod check above limits to 4 times an hour
}

const setupNightlyAlert = (timer, setTimer, applied, setApplied, stats) => {
  if (Notification.permission !== "granted") {
    const interfaceBtns = document.querySelectorAll('.HeaderTabs__tab');
    
    interfaceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        notify('Thanks for enabling desktop notifications.');
      });
    });
  }

  checkTime(timer, setTimer, applied, setApplied, stats);
}

const Body = (props) => {
  const { activeTabId, tabs } = props;
  const activeTab = tabs[activeTabId];

  const [success, setSuccess] = useState(false); // used to show green animation toast thing
  const [stats, setStats] = useState({});
  const [timer, setTimer] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        clearFields();
      }, 1400);
    }
  }, [success]);

  useEffect(() => {
    if (stats?.totalJobsViewed) {
      setupNightlyAlert(timer, setTimer, applied, setApplied, stats);
    }
  }, [stats]);

  useEffect(() => {
    getStats(setStats);
  }, []);

  return (
    <div className="Body">
      {success && <div className="Body__toast slide-down-fade-out">Added!</div>}
      {activeTab === 'Overview' && overview(stats)}
      {activeTab === 'Applied' && applyForm(saveData, setSuccess)}
      {activeTab === 'Did Not Apply' && didNotApplyForm(saveData, setSuccess)}
    </div>
  );
}

export default Body;