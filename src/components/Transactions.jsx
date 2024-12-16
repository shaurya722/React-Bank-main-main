import React, { useState, useEffect } from "react";
import axios from "axios";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccountFrom, setSelectedAccountFrom] = useState("");
  const [selectedAccountTo, setSelectedAccountTo] = useState("");
  const [selectedBankFrom, setSelectedBankFrom] = useState("");
  const [selectedBankTo, setSelectedBankTo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentOption, setPaymentOption] = useState("Transfer Now");
  const [time, setTime] = useState("");
  const token = localStorage.getItem("accessToken");

  const API_ACCOUNTS = "http://localhost:8000/home/accounts/"; // API endpoint to fetch accounts
  const API_TRANSACTION = "http://localhost:8000/home/transactions/"; // API endpoint for transactions

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(API_ACCOUNTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(res.data); // Storing accounts data
      } catch (err) {
        console.error("Error fetching accounts:", err.response?.data || err.message);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(API_TRANSACTION, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Transactions fetched:", res.data); 
        
        setTransactions(res.data.transactions); 
      } catch (err) {
        console.error("Error fetching transactions:", err.response?.data || err.message);
      }
    };
    
    fetchAccounts();
    fetchTransactions();
  }, [token]);

  // Handle transaction submission
  const handleTransfer = async () => {
    if (!selectedAccountFrom || !selectedBankFrom || !selectedAccountTo || !selectedBankTo || !amount) {
      alert("All fields are required.");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const res = await axios.post(
        API_TRANSACTION,
        {
          account_from: selectedAccountFrom,
          bank_from: selectedBankFrom,
          account_to: selectedAccountTo,
          bank_to: selectedBankTo,
          amount: amount,
          time: paymentOption === "Schedule Payment" ? time : null, // Only send time if scheduling
          payment_option: paymentOption,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Transaction created:", res.data);
      alert("Transaction successful!");
    } catch (err) {
      console.error("Error creating transaction:", err.response?.data || err.message);
      alert("Transaction failed. Please try again.");
    }
  };

  // Extract unique bank names
  const banks = [...new Set(accounts.map(account => account.bank))];

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
        <select
          id="bank_to"
          value={selectedBankTo}
          onChange={(e) => setSelectedBankTo(e.target.value)}
        >
          <option value="">Select Bank</option>
          {banks.map((bank, index) => (
            <option key={index} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      {/* Recipient Account */}
      <div>
        <label htmlFor="account_to">To Account:</label>
        <select
          id="account_to"
          value={selectedAccountTo}
          onChange={(e) => setSelectedAccountTo(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts
            .filter((account) => account.bank === selectedBankTo)
            .map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_type} - {account.balance} ({account.bank})
              </option>
            ))}
        </select>
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

      <h2>Recent Transactions</h2>
{transactions.length > 0 ? (
  <table>
    <thead>
      <tr>
        <th>From Account</th>
        <th>To Account</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((transaction, index) => (
        <tr key={index}>
          <td>{transaction.account_from}</td>
          <td>{transaction.account_to}</td>
          <td>{transaction.amount}</td>
          <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No transactions found.</p>
)}


    </>
  );
}

export default Transactions;
