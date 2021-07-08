import React, { useEffect, useState } from 'react'
import Grid from '../../components/Grid'
import qs from 'qs'
import { ytApi } from '../../lib/api/api'

const Search = ({ location, onClick }) => {
  const [items, setItems] = useState(null)
  const [, setError] = useState(false)

  useEffect(() => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })

    async function fetchSearch() {
      if (query.keyword === localStorage.getItem('term'))
        return setItems(JSON.parse(localStorage.getItem('items')))

      if (!query.keyword) setItems(null)

      try {
        const {
          data: { items },
        } = await ytApi.search(query.keyword)

        setItems(items)

        localStorage.setItem('term', query.keyword)
        localStorage.setItem('items', JSON.stringify(items))
      } catch (error) {
        setError(error)
      }
    }

    fetchSearch()
  }, [location])

  return <Grid items={items} title="검색 결과" onClick={onClick} />
}

export default Search
