'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

const ImportButton: React.FC = () => {
  const [sets, setSets] = useState<string[]>([])
  const [selectedSet, setSelectedSet] = useState<string>('')

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await fetch('/api/get-sets')
        const data = await response.json()
        setSets(data.sets || [])
      } catch (error) {
        console.error('Error fetching sets:', error)
      }
    }

    fetchSets()
  }, [])

  const handleImport = async () => {
    if (!selectedSet) {
      alert('Please select a set to import.')
      return
    }

    try {
      const response = await fetch('/api/import-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setName: selectedSet }),
      })

      const result = await response.json()
      alert(result.message)
    } catch (error) {
      console.error('Error importing cards:', error)
      alert('An error occurred during import.')
    }
  }

  return (
    <div>
      <select
        value={selectedSet}
        onChange={(e) => setSelectedSet(e.target.value)}
        style={{ marginRight: '10px' }}
      >
        <option value="">Select a Set</option>
        {sets.map((set) => (
          <option key={set} value={set}>
            {set}
          </option>
        ))}
      </select>
      <Button onClick={handleImport}>Import Cards</Button>
    </div>
  )
}

export default ImportButton
