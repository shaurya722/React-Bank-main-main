import React, { useState, useEffect } from "react";
import Tran_data from './Tran_data'; // Ensure this component is implemented properly.
import axios from "axios";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountFrom, setSelectedAccountFrom] = useState("");
  const [accountTo, setAccountTo] = useState("");
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
        console.log('Accounts:', res.data);
      } catch (err) {
        console.error("Error fetching accounts:", err.response?.data || err.message);
      }
    };

    fetchAccounts();
  }, [token]);

  // Handle transaction submission
  const handleTransfer = async () => {
    if (!selectedAccountFrom || !accountTo || !amount) {
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
          account_to: accountTo,
          amount: amount,
          time: paymentOption === "Schedule Payment" ? time : null, // Only send time if scheduling
          payment_option: paymentOption,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Transaction successful!");
    } catch (err) {
      console.error("Error creating transaction:", err.response?.data || err.message);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <>
      <h1>Transactions</h1>

      {/* Sender Account */}
      <div>
        <label htmlFor="account_from">From Account:</label>
        <select
          id="account_from"
          value={selectedAccountFrom}
          onChange={(e) => setSelectedAccountFrom(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.id}-{account.account_type} - {account.balance} ({account.bank})
            </option>
          ))}
        </select>
      </div>

      {/* Recipient Account */}
      <div>
        <label htmlFor="account_to">To Account:</label>
        <input
          id="account_to"
          type="text"
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
          min={0}
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

      {/* Recent Transactions */}
      <Tran_data />
    </>
  );
}

export default Transactions;
