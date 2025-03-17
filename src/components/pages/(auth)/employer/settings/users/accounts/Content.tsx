'use client';
import React, { useState } from 'react';

const Content = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState([
        { username: 'johndoe123', email: 'john.doe@example.com', status: 'Active', expiryDate: '31/12/2024', attempts: 0 },
        { username: 'janesmith456', email: 'jane.smith@example.com', status: 'Inactive', expiryDate: '15/11/2024', attempts: 2 },
        { username: 'mikejohnson789', email: 'mike.johnson@example.com', status: 'Active', expiryDate: '01/03/2025', attempts: 1 },
    ]);

    const handleSearch = (event: any) => {
        // Implement search functionality
    };

    const showNotification = (message: any) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <div className="font-sans">
            <header className="bg-white shadow-md relative">
                {/* Header content */}
            </header>

            <div id="successNotification" className={`fixed top-4 right-4 bg-green-500 text-white py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ${successMessage ? '' : 'hidden'}`}>
                <p>{successMessage}</p>
            </div>

            <main>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-2">
                        {/* Date range inputs and search bar */}
                        <input type="text" placeholder="Search" onKeyUp={handleSearch} className="w-[350px] pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none" />
                    </div>

                    {/* Table Section */}
                    <div className="mt-8 flex flex-col">
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="py-2 text-center text-gray-800">Username</th>
                                    <th className="py-2 text-center text-gray-800">Email</th>
                                    <th className="py-2 text-center text-gray-800">Account Status</th>
                                    <th className="py-2 text-center text-gray-800">Access Expiry Date</th>
                                    <th className="py-2 text-center text-gray-800">Reset Password Attempts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index} className="border-b border-gray-300">
                                        <td className="py-4 text-center">{user.username}</td>
                                        <td className="py-4 text-center">{user.email}</td>
                                        <td className="py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-sm ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-center">{user.expiryDate}</td>
                                        <td className="py-4 text-center">{user.attempts}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Content;