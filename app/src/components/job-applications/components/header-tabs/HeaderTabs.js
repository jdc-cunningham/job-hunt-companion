import './HeaderTabs.scss';

const HeaderTabs = (props) => {
  const tabs = ['Overview', 'Applied', 'Did Not Apply'];
  const { activeTabId, setActiveTabId } = props;

  return (
    <div className="HeaderTabs">
      {tabs.map((tab, tabId) => (
        <div
          className={`HeaderTabs__tab ${activeTabId === tabId ? 'active' : ''}`}
          onClick={() => setActiveTabId(tabId)}
        >
          {tabs[tabId]}
        </div>
      ))}
    </div>
  );
}

export default HeaderTabs;