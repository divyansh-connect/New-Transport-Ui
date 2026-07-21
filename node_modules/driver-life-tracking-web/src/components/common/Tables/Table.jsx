import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '../EmptyState/EmptyState';
import { Loader } from '../Loader/Loader';
import { Button } from '../Button/Button';
import './Table.css';

export const Table = ({
  headers = [],
  data = [],
  renderRow,
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items available to display right now.',
  onEmptyAction,
  emptyActionLabel,
  pagination,
  className = '',
}) => {
  return (
    <div className={`table-wrapper ${className}`}>
      <div className="table-responsive">
        <table className="web-table">
          <thead>
            <tr>
              {headers.map((head, idx) => (
                <th key={idx}>
                  <div className="th-content">
                    <span>{typeof head === 'string' ? head : head.label}</span>
                    {typeof head === 'object' && head.sortable && (
                      <ArrowUpDown size={14} className="sort-icon" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length}>
                  <div className="table-loader-container">
                    <Loader text="Fetching data..." />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && data.length > 0 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing <strong>{((pagination.currentPage - 1) * pagination.pageSize) + 1}</strong> to{' '}
            <strong>{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems || data.length)}</strong> of{' '}
            <strong>{pagination.totalItems || data.length}</strong> results
          </span>

          <div className="pagination-controls">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={ChevronLeft}
              disabled={pagination.currentPage <= 1}
              onClick={pagination.onPrev}
            >
              Previous
            </Button>
            <span className="pagination-page-number">
              Page {pagination.currentPage} of {pagination.totalPages || 1}
            </span>
            <Button
              variant="secondary"
              size="sm"
              rightIcon={ChevronRight}
              disabled={pagination.currentPage >= (pagination.totalPages || 1)}
              onClick={pagination.onNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
