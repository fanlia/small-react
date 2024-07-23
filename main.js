
import React, { createElement, Fragment, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom"

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons'

import {
  Button,
  Result,
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Checkbox,
  Form,
  Input,
  Flex,
} from 'antd'

const { Header, Content, Footer, Sider } = Layout

document.body.style.margin = '0'

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
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

const App = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return createElement(Layout, { style: { minHeight: '100vh'} },
    createElement(Sider, { collapsible: true, collapsed, onCollapse: setCollapsed },
      createElement('div', { className: 'demo-logo-vertical '}, 'LOGO'),
      createElement(Menu, { theme: 'dark', defaultSelectedKeys: ['1'], mode: 'inline', items }),
    ),
    createElement(Layout, {},
      createElement(Header, { style: { padding: 0, background: colorBgContainer } }),
      createElement(Content, { style: { margin: '0 16px' } },
        createElement(Breadcrumb, { style: { margin: '16px 0'}, items: [ { title: 'User' }, { title: 'Bill' } ] }),
        createElement('div', { style: { padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG } },
          createElement(Outlet),
        ),
      ),
      createElement(Footer, { style: { textAlign: 'center' } },
        'Ant Design ©',
        new Date().getFullYear(),
        ' Created by Ant UED',
      ),
    ),
  )
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

const DemoPage = (name = 'demo') => () => {
  return createElement(Fragment, null,
    createElement('h2', null, name),
    createElement(Link, { to: '/' }, 'Back Home'),
  )
}

const Login = () => {
  const navigate = useNavigate()

  const onFinish = values => {
    console.log({values})
    navigate('/')
  }

  return createElement(Flex, { style: { height: '100vh' }, justify: 'center', align: 'center' },
    createElement(Form, { initialValues: { remember: true }, onFinish },
      createElement(Form.Item, { name: 'email', rules: [{ required: true, message: 'Please input your Email!',}] },
        createElement(Input, { prefix: createElement(UserOutlined), placeholder: 'Email' }),
      ),
      createElement(Form.Item, { name: 'password', rules: [{ required: true, message: 'Please input your Password!',}] },
        createElement(Input, { prefix: createElement(LockOutlined), placeholder: 'Password' }),
      ),
      createElement(Form.Item, { name: 'remember', valuePropName: 'checked' },
        createElement(Checkbox, null, 'Remember me'),
      ),
      createElement(Form.Item, null,
        createElement(Button, { type: 'primary', htmlType: 'submit' }, 'Log in'),
      ),
    ),
  )
}

const Counter = () => {
  const [count, setCount] = useState(0)

  return createElement(Button, {
    type: 'primary',
    onClick: () => setCount((count) => count + 1),
  }, 'count is ', count)
}

const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(App),
    errorElement: createElement(ErrorPage),
    children: [
      {
        path: '/demo',
        element: createElement(DemoPage('demo')),
      },
    ],
  },
  {
    path: '/login',
    element: createElement(Login),
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(React.StrictMode, null, createElement(RouterProvider, { router }))
)
