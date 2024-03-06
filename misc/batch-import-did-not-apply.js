// https://stackoverflow.com/a/57633528/2710227

const { parse } = require('csv-parse')
const fs = require('fs')
const axios = require('axios');

const baseApiPath = 'http://localhost:5076';
const data = [];

const addJobApp = (data) => new Promise(resolve => {
  axios.post(
    `${baseApiPath}/import-job-app`,
    data
  )
  .then((res) => {
    if (res.status === 201) {
      resolve(true);
    } else {
      console.log('Failed to save job application');
      resolve(false);
    }
  })
  .catch((err) => {
    console.log('Failed to save job application');
    console.error(err);
    resolve(false);
  });
});

const _mdyToYmd = (mdy) => {
  const dateParts = mdy.split('/');
  return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
}

const startBatchInsert = async () => {
  // there is a for of way to do this I've used before
  if (data.length) {
    const jobApp = data[0];

    const jobAppData = {
      date: `${_mdyToYmd(jobApp[0])} 00:00:00`,
      companyName: jobApp[1],
      jobInfo: '',
      source: '',
      techStack: '',
      whyNotApply: jobApp[2],
      status: ''
    };

    const jobAppAdded = await addJobApp(jobAppData);

    if (jobAppAdded) {
      console.log('job added');
      data.shift();
      startBatchInsert();
    } else {
      console.log('err');
    }
  }
}

fs.createReadStream('./did-not-apply.csv')
  .pipe(parse({ delimiter: ',' }))
  .on('data', async (r) => {
    data.push(r);
  })
  .on('end', () => {
    console.log('done importing');
    data.shift(); // drop headers
    startBatchInsert();
  });
