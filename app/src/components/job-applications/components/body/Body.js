import './Body.scss';

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

const applyForm = () => (
  <div className="Body__apply-form">
    <p>Today is {getDate()}</p>
    <input type="text" placeholder="company name"/>
    <input type="text" placeholder="stack info"/>
    <textarea placeholder="additional info"/>
    <button type="button">Save</button>
  </div>
);

const didNotApplyForm = () => (
  <div className="Body__apply-form">
    <p>Today is {getDate()}</p>
    <input type="text" placeholder="company name"/>
    <input type="text" placeholder="reason"/>
    <button type="button">Save</button>
  </div>
);

const Body = (props) => {
  const { activeTabId, tabs } = props;
  const activeTab = tabs[activeTabId];

  return (
    <div className="Body">
      {activeTab === 'Overview' && overview()}
      {activeTab === 'Applied' && applyForm()}
      {activeTab === 'Did Not Apply' && didNotApplyForm()}
    </div>
  );
}

export default Body;