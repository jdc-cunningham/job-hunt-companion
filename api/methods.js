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

const addJobApp = async (req, res) => {
  // most of these fields are optional
  const { companyName, jobInfo, source, techStack, whyNotApply, status } = req.body;
  const now = formatTimeStr(getDateTime());

  pool.query(
    `INSERT INTO job_applications SET id = ?, company_name = ?, job_info = ?, source = ?, tech_stack = ?, why_not_apply = ?, status = ?, created = ?`,
    [null, companyName, jobInfo, source, techStack, whyNotApply, status, now],
    (err, qres) => {
      if (err) {
        console.error('failed to insert note', err);

        res.status(400).send({
          err: true,
          msg: 'failed to add note'
        });
      } else {
        res.status(201).send({
          err: false,
        });
      }
    }
  );
};

module.exports = {
  addJobApp,
}