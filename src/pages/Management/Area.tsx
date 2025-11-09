import React from 'react';

interface Area {
    id: number;
    name: string;
    description: string;
    coordinates: [number, number];
}

const areaData: Area[] = [
    { id: 1, name: 'Area 1', description: 'Area 1 description', coordinates: [22, 105] },
    { id: 2, name: 'Area 2', description: 'Area 2 description', coordinates: [22, 105] },
    { id: 3, name: 'Area 3', description: 'Area 3 description', coordinates: [22, 105] },
];

const AreaTable: React.FC = () => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Coordinates</th>
                </tr>
            </thead>
            <tbody>
                {areaData.map((area) => (
                    <tr key={area.id}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{area.id}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{area.name}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{area.description}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{area.coordinates.join(', ')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
};

export default AreaTable;