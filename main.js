
import React, { createElement, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  Link,
} from "react-router-dom"

import { Button, Result } from 'antd'

const App = () => {
  const [count, setCount] = useState(0)

  return createElement(Button, {
    type: 'primary',
    onClick: () => setCount((count) => count + 1),
  }, 'count is ', count)
}

const ErrorPage = () => {
  const error = useRouteError()
  console.error(error)

  return createElement(Result, {
    status: error.status,
    title: error.status,
    subTitle: error.statusText || error.message,
    extra: createElement(Button, { type: 'primary' }, createElement(Link, { to: '/' }, 'Back Home')),
  })
}

const router = createBrowserRouter([
  {
    path: "/",
    element: createElement(App),
    errorElement: createElement(ErrorPage),
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(React.StrictMode, null, createElement(RouterProvider, { router }))
)
