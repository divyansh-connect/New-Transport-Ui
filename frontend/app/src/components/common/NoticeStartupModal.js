import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const DEFAULT_FALLBACK_NOTICES = [
  { id: 'notice-1', title: 'High-Demand Cargo Routes Available' },
  { id: 'notice-2', title: 'Partner Workshop Expansion Notice' },
  { id: 'notice-3', title: 'Monsoon Safety Guidelines' }
];

export default function NoticeStartupModal() {
  const { registeredUser, updateUnreadNotices } = useTheme();

  useEffect(() => {
    let isMounted = true;
    const syncNotices = async () => {
      try {
        const { apiFetch } = require('../../utils/api');
        const data = await apiFetch('/notices');
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            updateUnreadNotices(data);
          } else {
            updateUnreadNotices(DEFAULT_FALLBACK_NOTICES);
          }
        }
      } catch (err) {
        if (isMounted) {
          updateUnreadNotices(DEFAULT_FALLBACK_NOTICES);
        }
      }
    };

    syncNotices();
    return () => {
      isMounted = false;
    };
  }, [registeredUser]);

  // NO POPUP MODAL ON SCREEN — Return null cleanly
  return null;
}
