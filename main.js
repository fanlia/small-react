
import { startApp, DemoPage } from './index'
import { createElement, useState } from 'react'

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

import {
  Button,
  DatePicker,
  Space,
} from 'antd'

const menu_items = [
  {
    key: '/',
    label: 'Home',
    icon: createElement(PieChartOutlined),
  },
  {
    key: '/about',
    label: 'About',
    icon: createElement(DesktopOutlined),
  },
  {
    key: '/test',
    label: 'Test',
    icon: createElement(FileOutlined),
  },
]

const Home = () => {
  const [count, setCount] = useState(0)

  return createElement(Space, null,
    createElement(Button, {
      type: 'primary',
      onClick: () => setCount((count) => count + 1),
    }, 'count is ', count),
    createElement(DatePicker),
  )
}

const routes = [
  {
    path: '/',
    element: createElement(Home),
  },
  {
    path: '/about',
    element: createElement(DemoPage('About')),
  },
  {
    path: '/test',
    element: createElement(DemoPage('Test')),
  },
]

startApp({
  menu_items,
  routes,
})
