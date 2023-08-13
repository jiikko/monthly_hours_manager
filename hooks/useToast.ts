import { useState } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState('');
  const [showToast, setToast] = useState(false);

  const showToastFunction = (message) => {
    setMessage(message);
    setToast(true);
  };

  const hideToast = () => setToast(false);

  return {
    message,
    showToast,
    hideToast,
    showToastFunction
  };
};
