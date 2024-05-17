import Content from "./components/content/Content";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-row">
      <div className="w-[20%] h-full bg-blue-100 min-h-screen">
        <Sidebar />
      </div>
      <div className="w-[80%] h-full bg-blue-300 min-h-screen">
        <Content />
      </div>
    </div>
  );
}

export default App;
