import './Body.scss';

const overview = () => (
  <div className="Body__overview">

  </div>
);

const applyForm = () => (
  <div className="Body__apply-form">
    <input type="text" placeholder="company name"/>
    <input type="text" placeholder="stack info"/>
    <textarea placeholder="additional info"/>
    <button type="button">Save</button>
  </div>
);

const didNotApplyForm = () => (
  <div className="Body__apply-form">
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