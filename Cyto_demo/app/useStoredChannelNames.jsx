import { useEffect, useState } from 'react';

const useStoredChannelNames = () => {
  const [channelNames, setChannelNames] = useState([]);

  useEffect(() => {
    const storedChannelNames = localStorage.getItem('channelNames');
    if (storedChannelNames) {
      setChannelNames(JSON.parse(storedChannelNames));
    }
  }, []);

  return channelNames;
};

export default useStoredChannelNames;
