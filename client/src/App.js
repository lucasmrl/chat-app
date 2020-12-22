import axios from "axios";

function App() {
  const hitBackend = () => {
    axios.get("/test").then((response) => {
      console.log(response.data);
    });
  };

  return (
    <div className="App">
      <h1>Chat-app!</h1>
      <button onClick={hitBackend}>
        Test connection with the server (check the console for the response)
      </button>
    </div>
  );
}

export default App;
