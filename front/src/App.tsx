import React, { useCallback, useState } from "react";
import { CustomerResponse } from "../../backend/src/types/CustomerResponse";
import { CustomerErrors } from "../../backend/src/types/Errors";
import "./App.css";

function App() {
  const [file, setFile] = useState<any>();
  const [customerResponse, setCustomerResponse] = useState<CustomerResponse[]>(
    []
  );
  const [customerErrors, setCustomerErrors] = useState<CustomerErrors[]>([]);

  const fileChangeHandler = (e: any) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    setFile(files.item(0));
  };

  const uploadFileHandler = async (e: React.ChangeEvent<{}>) => {
    const result = await fetch("https://50iw1vifu6.execute-api.us-east-1.amazonaws.com/dev/qualified", {
      method: "PUT",
      body: file,
    });
    const data = await result.json();
    setCustomerResponse(data.responses);
    setCustomerErrors(data.errors);
    setFile("");
  };

  const showTables = useCallback(() => {
    if (customerResponse.length > 0 || customerErrors.length > 0) return true;
    return false;
  }, [customerResponse, customerErrors]);

  const getCssClass = useCallback((score: number, riskLevel: number) => {
    if (score === 0 && riskLevel === 0) return "risk0";
    if (riskLevel === 0) return "risk1";
    if (riskLevel === 1) return "risk2";
    if (riskLevel === 2) return "risk3";
  }, []);

  const loadNewCustomer = useCallback(() => {
    setCustomerResponse([]);
    setCustomerErrors([]);
  }, []);

  return (
    <div className="App">
      {!showTables() && (
        <div className="App-header">
          <h1>Welcome to your real-time insurance qualification</h1>
          <p>
            Please upload a CSV file with the possible customers
            <div>
              <input type="file" onChange={fileChangeHandler} />
            </div>
          </p>
          {file && (
            <div>
              <button className="submitButton" onClick={uploadFileHandler}>
                Start process
              </button>
            </div>
          )}
        </div>
      )}
      {showTables() && (
        <div>
          <button className="goBackBtn" onClick={loadNewCustomer}>
            Qualified new customers
          </button>
          <h4>Below the qualification results</h4>
          <table className="responseTable">
            <thead>
              <tr>
                <td>Name</td>
                <td>BMI</td>
                <td>Score</td>
                <td>Need Interview</td>
                <td>Monthly Fee</td>
                <td>Risk Level</td>
              </tr>
            </thead>
            <tbody>
              {customerResponse.map((customer) => {
                const cssClass = getCssClass(
                  customer.score,
                  customer.riskLevel
                );
                return (
                  <tr className={cssClass}>
                    <td>{customer.name}</td>
                    <td>{customer.BMI}</td>
                    <td>{customer.score}</td>
                    <td>{customer.needInterview ? "Yes" : "No"}</td>
                    <td className="usd">{`$ ${customer.monthlyFee}`}</td>
                    <td>{customer.riskLevel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {customerErrors.length > 0 && (
            <div>
              <h4>These are the customers we could not process</h4>
              <table className="errorsTable">
                <thead>
                  <tr>
                    <td>Customer</td>
                    <td>Error</td>
                  </tr>
                </thead>
                <tbody>
                  {customerErrors.map((error) => {
                    return (
                      <tr>
                        <td>{error.name}</td>
                        <td>{error.message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
