// old code
import "./App.css";
import { TabMenu } from "primereact/tabmenu";
import "primeicons/primeicons.css";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // set activeIndex given the path
  let initialActiveIndex = 0;
  if (location.pathname === "/discover") initialActiveIndex = 0;
  else if (location.pathname === "/user/shortcuts") initialActiveIndex = 1;
  else if (location.pathname === "/user/applications") initialActiveIndex = 2;
  else if (location.pathname === "/user/ideas") initialActiveIndex = 3;
  else if (location.pathname === "/user/account") initialActiveIndex = 4;

  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const items = [
    {
      label: "Discover",
      icon: "pi pi-home",
      command: () => {
        navigate("/discover");
        setActiveIndex(0);
      },
    },
    {
      label: "My Shortcuts",
      icon: "pi pi-chart-line",
      command: () => {
        navigate("/user/shortcuts");
        setActiveIndex(1);
      },
    },
    {
      label: "My Applications",
      icon: "pi pi-microsoft",
      command: () => {
        navigate("/user/applications");
        setActiveIndex(2);
      },
    },
    {
      label: "Ideas",
      icon: "pi pi-list",
      command: () => {
        navigate("/user/ideas");
        setActiveIndex(3);
      },
    },
    {
      label: "Account",
      icon: "pi pi-user",
      command: () => {
        navigate("/user/account");
        setActiveIndex(4);
      },
    },
  ];

  // get url of the page with react
  return (
    <div className="App">
      <div className="card">
        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
      </div>
      <div style={{ padding: "25px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
