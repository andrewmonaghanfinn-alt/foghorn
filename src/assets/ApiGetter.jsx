import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';

export default function ApiGetter({ apiUrl }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data?.page?.name ?? 'Unknown Service');
        setStatus(data?.status?.description ?? 'No status available');
      })
      .catch((error) => {
        console.error('Could not fetch status: ', error);
      });
  }, []);

  return <ServiceCard title={title} status={status} />;
}
