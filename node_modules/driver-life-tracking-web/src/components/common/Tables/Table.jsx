import React from 'react';
import './Table.css';

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="table-responsive">
      <table className="web-table">
        <thead>
          <tr>
            {headers.map((head, idx) => (
              <th key={idx}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  );
};
