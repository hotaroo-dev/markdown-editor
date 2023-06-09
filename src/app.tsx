import React, { useCallback, useState } from 'react'
import Editor from './editor'
import Preview from './preview'
import './app.css'

const App: React.FC = () => {
  const [doc, setDoc] = useState<string>('# Hello, World\n')

  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc)
  }, [])

  return (
    <div className="app">
      <Editor initialDoc={doc} onChange={handleDocChange} />
      <Preview doc={doc} />
    </div>
  )
}

export default App
