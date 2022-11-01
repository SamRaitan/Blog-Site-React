import { useState, useEffect } from 'react';

const useFetch = (url) => {
  //for the blogs
  const [data, setData] = useState(null);
  //for the loading while getting data
  const [isPending, setIsPending] = useState(true);
  //when data dosent work or no such think
  const [error, setError] = useState(null);

  useEffect(() => {
    //for when switching tabs very fast and data didnt load so not to get error
    const abortCont = new AbortController();

    setTimeout(() => {
      //getting url (the db) , line 12
      fetch(url, { signal: abortCont.signal })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 
        return res.json();
      })
      .then(data => {
        setIsPending(false);
        setData(data);
        setError(null);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          // auto catches network / connection error
          setIsPending(false);
          setError(err.message);
        }
      })
    }, 1000);

    // abort the fetch , line 12
    return () => abortCont.abort();
  }, [url])

  return { data, isPending, error };
}
 
export default useFetch;
