import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function AccountsTable() {
  const [accounts, setAccounts] = useState([]);
  const token = localStorage.getItem("accessToken"); // Replace with your authentication token if required

  const API_ENDPOINT = "http://localhost:8000/home/accounts"; // Replace with your endpoint

  // Fetch accounts and transactions from the API
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data);
        console.log("trna_data:", response.data);
      } catch (error) {
        console.error("Error fetching accounts data:", error.response?.data || error.message);
      }
    };

    fetchAccountsData();
  }, [token]);

  // Generate PDF for transactions
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Transactions Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    accounts.forEach((account, index) => {
      if (account.transactions && account.transactions.length > 0) {
        doc.setFontSize(14);
        doc.text(`Account ID: ${account.id} (${account.account_type})`, 14, 40 + index * 80);

        const transactionsData = account.transactions.map((transaction) => [
          transaction.account_from,
          transaction.account_to,
          transaction.amount,
          new Date(transaction.transaction_date).toLocaleString(),
        ]);

        doc.autoTable({
          head: [["From Account", "To Account", "Amount", "Transaction Date"]],
          body: transactionsData,
          startY: 45 + index * 80,
        });
      }
    });

    doc.save("Transactions_Report.pdf");
  };

  return (
    <div>
      <h2>Accounts and Transactions</h2>
      <button onClick={generatePDF} style={{ marginBottom: "20px", padding: "10px 15px", cursor: "pointer" }}>
        Download Transactions PDF
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Account ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>User</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Account Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Balance</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Bank</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Transactions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{account.id}</td>
              <td style={{ padding: "8px" }}>{account.user}</td>
              <td style={{ padding: "8px" }}>{account.account_type}</td>
              <td style={{ padding: "8px" }}>{account.balance}</td>
              <td style={{ padding: "8px" }}>{account.bank}</td>
              <td style={{ padding: "8px" }}>
                {account.transactions && account.transactions.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ border: "1px solid #ddd", padding: "4px", textAlign: "left" }}>
                          From Account
                        </th>
                        <th style={{ border: "1px solid #ddd", padding: "4px", textAlign: "left" }}>
                          To Account
                        </th>
                        <th style={{ border: "1px solid #ddd", padding: "4px", textAlign: "left" }}>
                          Amount
                        </th>
                        <th style={{ border: "1px solid #ddd", padding: "4px", textAlign: "left" }}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td style={{ padding: "4px" }}>{transaction.account_from}</td>
                          <td style={{ padding: "4px" }}>{transaction.account_to}</td>
                          <td style={{ padding: "4px" }}>{transaction.amount}</td>
                          <td style={{ padding: "4px" }}>
                            {new Date(transaction.transaction_date).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountsTable;
