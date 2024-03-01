import './HeaderTabs.scss';

const HeaderTabs = (props) => {
  const { activeTabId, setActiveTabId, tabs } = props;

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