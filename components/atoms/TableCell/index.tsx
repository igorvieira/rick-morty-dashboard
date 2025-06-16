import { ReactNode, TdHTMLAttributes } from 'react';

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  header?: boolean;
}

export function TableCell({ children, header = false, className = '', ...props }: TableCellProps) {
  const baseClasses = 'px-6 py-4 text-sm text-left';
  const headerClasses = header 
    ? 'font-medium text-gray-900 bg-gray-50 border-b border-gray-200' 
    : 'text-gray-700 border-b border-gray-200';

  if (header) {
    return (
      <th className={`${baseClasses} ${headerClasses} ${className}`} {...props}>
        {children}
      </th>
    );
  }

  return (
    <td className={`${baseClasses} ${headerClasses} ${className}`} {...props}>
      {children}
    </td>
  );
}