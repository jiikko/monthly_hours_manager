import React from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastComponent } from './toast';

describe('ToastComponent', () => {
  test('renders toast with the correct message', () => {
    const message = 'テストメッセージ';
    const hideToast = jest.fn();

    render(<ToastComponent message={message} showToast={true} hideToast={hideToast} />);

    expect(screen.getByText('通知')).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('calls hideToast function when close button is clicked', () => {
    const message = 'テストメッセージ';
    const hideToast = jest.fn();

    render(<ToastComponent message={message} showToast={true} hideToast={hideToast} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(hideToast).toHaveBeenCalledTimes(1);
  });

  it('does not render the toast when showToast is false', () => {
    const message = 'テストメッセージ';
    const hideToast = jest.fn();

    render(<ToastComponent message={message} showToast={false} hideToast={hideToast} />);
    expect(screen.queryByText(message)).toBeNull();
  });
});
