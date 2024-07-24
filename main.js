
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

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const menu_items = [
  getItem('Option 1', '1', createElement(PieChartOutlined)),
  getItem('Option 2', '2', createElement(DesktopOutlined)),
  getItem('User', 'sub1', createElement(UserOutlined), [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', createElement(TeamOutlined), [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', createElement(FileOutlined)),
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
    path: '/demo',
    element: createElement(DemoPage('demo')),
  },
]

startApp({
  menu_items,
  routes,
})
