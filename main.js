
import React, { createElement, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  const [count, setCount] = useState(0)

  return createElement('button', {
    onClick: () => setCount((count) => count + 1),
  }, 'count is ', count)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(React.StrictMode, null, createElement(App))
)
