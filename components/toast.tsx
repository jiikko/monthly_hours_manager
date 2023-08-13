import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

type ToastProps = {
  message: string;
  showToast: boolean;
  hideToast: () => void;
}

export const ToastComponent: React.FC<ToastProps> = ({ message, showToast, hideToast }) => {
  return (
    <ToastContainer position="top-center" className="position-fixed">
      <Toast onClose={hideToast} autohide show={showToast} delay={2000}>
        <Toast.Header>
          <strong className="mr-auto">通知</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
