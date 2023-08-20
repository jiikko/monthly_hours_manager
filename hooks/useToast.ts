import { useState } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState('');
  const [showToast, setToast] = useState(false);

  const notify = (message: string) => {
    setMessage(message);
    setToast(true);
  };

  const hideToast = () => setToast(false);

  return {
    message,
    showToast,
    hideToast,
    notify
  };
};
