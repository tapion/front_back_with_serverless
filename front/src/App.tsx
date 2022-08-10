import { useState } from "react";
import "./App.css";


function App() {

  const [file, setFile] = useState<any>();

  const fileChangeHandler = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const uploadFileHandler = async (e: any) => {
    console.log('Este es el file', file);
    const result = await fetch("http://localhost:4000/dev/hello", {
      method: 'PUT',
      body: file
    });
    const data = await result.json();

    console.log('Result: ', result)
    console.log('Body', data)
    setFile('');
  }
;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to your realtime qualification insurance</h1>
        <p>
          Please upload all the possible candidates
          <div>
            <input type="file" onChange={fileChangeHandler}/>
          </div>
        </p>
        <div>
          <button className="submitButton" onClick={uploadFileHandler}>Start process</button>
        </div>
      </header>
    </div>
  );
}

export default App;
