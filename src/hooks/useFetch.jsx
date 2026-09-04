import { useState, useEffect } from 'react';
import useToken from './useToken';
import { request } from '../services/api';

export function useFetch(url) {

  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const { token } = useToken();

  useEffect(() => {
    if (!url) return;

    request(url, { token })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });

  }, [url, token]); // <= si url change, useFetch relance la requête

  return { data, error };
}
