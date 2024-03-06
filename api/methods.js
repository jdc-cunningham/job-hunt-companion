const { pool } = require('./database/db_connect');
const { formatTimeStr, getDateTime } = require('./utils');

require('dotenv').config({
  path: './.env'
});

// technically you could do multiple jobs under the same company
const _jobAppExists = async (companyName) => (
  new Promise ((resolve, reject) => {
    pool.query(
      `SELECT id FROM job_applications WHERE company_name = ?`,
      [companyName],
      (err, qres) => {
        if (err) {
          reject(new Error("failed to search job applications"));
        } else {
          resolve({
            err: false,
            data: qres,
            exists: qres.length ? true : false
          });
        }
      }
    );
  })
);

const importJobApp = async (req, res) => {
  const { companyName, jobInfo, source, techStack, whyNotApply, status, date } = req.body;

  pool.query(
    `INSERT INTO job_applications SET id = ?, company_name = ?, job_info = ?, source = ?, tech_stack = ?, why_not_apply = ?, status = ?, created = ?`,
    [null, companyName, jobInfo, source, techStack, whyNotApply, status, date],
    (err, qres) => {
      if (err) {
        console.error('failed to insert job app', err);

        res.status(400).send({
          err: true,
          msg: 'failed to add job app'
        });
      } else {
        res.status(201).send({
          err: false,
        });
      }
    }
  );
};

const addJobApp = async (req, res) => {
  // most of these fields are optional
  const { companyName, jobInfo, source, techStack, whyNotApply, status } = req.body;
  const now = formatTimeStr(getDateTime());

  pool.query(
    `INSERT INTO job_applications SET id = ?, company_name = ?, job_info = ?, source = ?, tech_stack = ?, why_not_apply = ?, status = ?, created = ?`,
    [null, companyName, jobInfo, source, techStack, whyNotApply, status, now],
    (err, qres) => {
      if (err) {
        console.error('failed to insert job app', err);

        res.status(400).send({
          err: true,
          msg: 'failed to add job app'
        });
      } else {
        res.status(201).send({
          err: false,
        });
      }
    }
  );
};

const _groupJobApps = (jobApps) => {
  const jobAppDates = {};

  jobApps.forEach(jobApp => {
    const jobAppDate = jobApp.created;
    const jobApplied = !jobApp.why_not_apply;

    if (jobAppDate in jobAppDates) {
      if (jobApplied) {
        jobAppDates[jobAppDate].applied += 1;
      } else {
        jobAppDates[jobAppDate].notApplied += 1;
      }

      jobAppDates[jobAppDate].viewed += 1;
    } else {
      jobAppDates[jobAppDate] = {
        applied: jobApplied ? 1 : 0,
        notApplied: jobApplied ? 0 : 1,
        viewed: 1,
      }
    }
  });

  return jobAppDates;
}

// return info such as total jobs looked at (combination of apply/not apply)
// separation of the two
// returns date: count pairs for plots
const getStats = async (req, res) => {
  pool.query(
    `SELECT * from job_applications WHERE id > 0 ORDER BY created ASC`,
    (err, qres) => {
      if (err) {
        console.error('failed to get stats', err);

        res.status(400).send({
          err: true,
          msg: 'failed to get stats'
        });
      } else {
        // prep return data
        console.log(qres);

        res.status(200).send({
          data: {
            totalJobsViewed: qres.length,
            didNotApply: qres.filter(job => job.why_not_apply).length,
            applied: qres.filter(job => !job.why_not_apply).length, // this is a waste, can store, subtract
            appDateCount: _groupJobApps(qres),
          },
          err: false,
        });
      }
    }
  );
}

module.exports = {
  addJobApp,
  importJobApp,
  getStats
}