import { useState, useEffect } from 'react'
import useToken from './useToken'

export function useFetch(url) {

  const [data, setData] = useState()
  const [error, setError] = useState(false)
  const { token } = useToken()

  useEffect(() => {
    if (!url) return
    async function fetchData() {
      const init = {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      }
      try {
        console.log("API call to", url);
        const response = await fetch(url, init)
        const data = await response.json()
        // mise à jour du state déplacée ici ?
        setData(data)
      } catch (err) {
        console.log(err)
        setError(true)
      }
    }
    fetchData()
  }, [url, token]) // <= dépendance, si url change, useFetch est rappelée

  return { data, error }
}