import React, { useState, useEffect } from "react";
import Tran_data from './Tran_data'
import axios from "axios";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]); // Default as an empty array
  const [selectedAccountFrom, setSelectedAccountFrom] = useState("");
  const [accountTo, setAccountTo] = useState("");
  const [selectedBankFrom, setSelectedBankFrom] = useState("");
  const [bankTo, setBankTo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState("Transfer Now");
  const [time, setTime] = useState("");
  const token = localStorage.getItem("accessToken");

  const API_ACCOUNTS = "http://localhost:8000/home/accounts/"; // API endpoint to fetch accounts
  const API_TRANSACTION = "http://localhost:8000/home/transactions/"; // API endpoint for transactions

  // Fetch accounts and transactions from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(API_ACCOUNTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(res.data); // Storing accounts data
        console.log('account:',res.data);
      } catch (err) {
        console.error("Error fetching accounts:", err.response?.data || err.message);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(API_TRANSACTION, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
        console.log('trnsactions:',res.data); // Set transactions directly to the response data
      } catch (err) {
        console.error("Error fetching transactions:", err.response?.data || err.message);
      }
    };

    fetchAccounts();
    fetchTransactions();
  }, [token]);

  // Handle transaction submission
// Handle transaction submission
const handleTransfer = async () => {
  if (!selectedAccountFrom || !selectedBankFrom || !accountTo || !bankTo || !amount) {
    alert("All fields are required.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  // Validate that `accountTo` and `bankTo` exist in the accounts
  // const recipientAccount = accounts.find(
  //   (acc) => acc.id === parseInt(accountTo) && acc.bank === bankTo
  // );

  // if (!recipientAccount) {
  //   alert("Recipient account or bank does not exist. Please check your inputs.");
  //   return;
  // }

  try {
    const res = await axios.post(
      API_TRANSACTION,
      {
        account_from: selectedAccountFrom,
        bank_from: selectedBankFrom,
        account_to: accountTo,
        bank_to: bankTo,
        amount: amount,
        time: paymentOption === "Schedule Payment" ? time : null, // Only send time if scheduling
        payment_option: paymentOption,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Transaction successful!");

    // Refresh transactions
    const updatedTransactions = await axios.get(API_TRANSACTION, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(updatedTransactions.data);
  } catch (err) {
    console.error("Error creating transaction:", err.response?.data || err.message);
    alert("Transaction failed. Please try again.");
  }
};

  // Extract unique bank names
  const banks = [...new Set(accounts.map((account) => account.bank))];

  return (
    <>
      <h1>Transactions</h1>

      {/* Sender Bank */}
      <div>
        <label htmlFor="bank_from">From Bank:</label>
        <select
          id="bank_from"
          value={selectedBankFrom}
          onChange={(e) => setSelectedBankFrom(e.target.value)}
        >
          <option value="">Select Bank</option>
          {banks.map((bank, index) => (
            <option key={index} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      {/* Sender Account */}
      <div>
        <label htmlFor="account_from">From Account:</label>
        <select
          id="account_from"
          value={selectedAccountFrom}
          onChange={(e) => setSelectedAccountFrom(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts
            .filter((account) => account.bank === selectedBankFrom)
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_type} - {account.balance} ({account.bank})
              </option>
            ))}
        </select>
      </div>

      {/* Recipient Bank */}
      <div>
        <label htmlFor="bank_to">To Bank:</label>
        <input
          id="bank_to"
          type="bank_to"
          value={bankTo}
          onChange={(e) => setBankTo(e.target.value)}
        />
      </div>

      {/* Recipient Account */}
      <div>
        <label htmlFor="account_to">To Account:</label>
        <input
          id="account_to"
          type="account_to"
          value={accountTo}
          onChange={(e) => setAccountTo(e.target.value)}
        />
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Payment Option */}
      <div>
        <label htmlFor="paymentOption">Payment Option:</label>
        <select
          id="paymentOption"
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
        >
          <option value="Transfer Now">Transfer Now</option>
          <option value="Schedule Payment">Schedule Payment</option>
        </select>
      </div>

      {/* Schedule Payment Time */}
      {paymentOption === "Schedule Payment" && (
        <div>
          <label htmlFor="time">Schedule Time (minutes):</label>
          <input
            id="time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      )}

      {/* Transfer Button */}
      <div>
        <button onClick={handleTransfer}>Transfer</button>
      </div>

      {/* <h2>Recent Transactions</h2>
{transactions && transactions.length > 0 ? (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>From Account</th>
        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>To Account</th>
        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Amount</th>
        <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Date</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((transaction, index) => {
        const accountFrom = accounts.find((acc) => acc.id === transaction.account_from);
        const accountTo = accounts.find((acc) => acc.id === transaction.account_to);
        return (
          <tr key={index}>
            <td style={{ padding: "8px" }}>
              {accountFrom
                ? `${accountFrom.account_type} - ${accountFrom.balance} (${accountFrom.bank})`
                : transaction.account_from}
            </td>
            <td style={{ padding: "8px" }}>
              {accountTo
                ? `${accountTo.account_type} - ${accountTo.balance} (${accountTo.bank})`
                : transaction.account_to}
            </td>
            <td style={{ padding: "8px" }}>{transaction.amount}</td>
            <td style={{ padding: "8px" }}>{transaction.transaction_date}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
) : (
  <p>No transactions found.</p>
)} */}
<Tran_data/>
    </>
  );
}

export default Transactions;
