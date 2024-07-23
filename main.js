
import React, { createElement, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import { Button } from 'antd'

const App = () => {
  const [count, setCount] = useState(0)

  return createElement(Button, {
    type: 'primary',
    onClick: () => setCount((count) => count + 1),
  }, 'count is ', count)
}

const router = createBrowserRouter([
  {
    path: "/",
    element: createElement(App),
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(React.StrictMode, null, createElement(RouterProvider, { router }))
)
