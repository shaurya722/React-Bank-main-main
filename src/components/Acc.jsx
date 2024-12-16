import React, { useState } from 'react';
import axios from 'axios';

function Acc() {
    const API = 'http://localhost:9000/customers/';  // Adjust to your customers API endpoint

    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);

    const handleAcc = async () => {
        try {
            const res = await axios.get(API);  // Fetch customer data
            console.log(res.data);  // Log full response

            setCustomers(res.data);  // Set the customer data in state
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Error fetching customers');
        }
    };

    return (
        <div>
            <button onClick={handleAcc}>Fetch Customers</button>

            {error && <p>{error}</p>}  {/* Display error message if any */}

            {customers.length > 0 ? (
                customers.map(customer => (
                    <div key={customer.id}>
                        <h2>Customer: {customer.customer_name}</h2>
                        <p>Contact Info: {customer.contact_info}</p>

                        <h3>Accounts:</h3>
                        <ul>
                            {customer.accounts.map(account => (
                                <li key={account.id}>
                                    <h4>Account Type: {account.account_type}</h4>
                                    <p>Balance: ${account.balance}</p>
                                    <p>Bank Name: {account.bank_name}</p> {/* Display bank name */}

                                    {/* Displaying transactions */}
                                    <h5>Transactions:</h5>
                                    <ul>
                                        {account.transactions.length > 0 ? (
                                            account.transactions.map(transaction => (
                                                <li key={transaction.id}>
                                                    <p>Transaction ID: {transaction.id}</p>
                                                    <p>Date: {new Date(transaction.transaction_date).toLocaleString()}</p>
                                                    <p>Type: {transaction.transaction_type}</p>
                                                    <p>Amount: ${transaction.amount}</p>
                                                </li>
                                            ))
                                        ) : (
                                            <p>No transactions found.</p>
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No customers found.</p>
            )}
        </div>
    );
}

export default Acc;
