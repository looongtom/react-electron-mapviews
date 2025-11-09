import React from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// Sample data conforming to the User interface
const userData: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 24 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 45 },
];

const UserTable: React.FC = () => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Age</th>
                </tr>
            </thead>
            <tbody>
                {userData.map((user) => (
                    <tr key={user.id}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.id}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.name}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.email}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.age}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;