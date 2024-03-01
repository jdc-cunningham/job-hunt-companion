import HeaderTabs from "./components/header-tabs/HeaderTabs";
import Body from "./components/body/Body";

import "./JobApplications.scss";

const JobApplications = (props) => {
  return (
    <div className="JobApplications">
      <HeaderTabs/>
      <Body/>
    </div>
  );
}

export default JobApplications;