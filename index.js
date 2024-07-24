
import 'antd/dist/reset.css'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'

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
  ConfigProvider,
  App as AntdApp,
  Spin,
} from 'antd'

const { Header, Content, Footer, Sider } = Layout

export const DemoPage = (name = 'demo') => () => {
  return createElement(Fragment, null,
    createElement('h2', null, name),
    createElement(Link, { to: '/' }, 'Back Home'),
  )
}

export const Loading = () => {
  return createElement(Spin)
}

export const startApp = ({
  mount = 'root',
  menu_items = [],
  routes = [],
}) => {

  const App = () => {
    const [collapsed, setCollapsed] = useState(false)
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    return createElement(Layout, { style: { minHeight: '100vh'} },
      createElement(Sider, { collapsible: true, collapsed, onCollapse: setCollapsed },
        createElement('div', { className: 'demo-logo-vertical '}, 'LOGO'),
        createElement(Menu, { theme: 'dark', defaultSelectedKeys: ['1'], mode: 'inline', items: menu_items }),
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

  const router = createBrowserRouter([
    {
      path: '/',
      element: createElement(App),
      errorElement: createElement(ErrorPage),
      children: routes,
    },
    {
      path: '/login',
      element: createElement(Login),
    },
  ])

  ReactDOM.createRoot(document.getElementById(mount)).render(
    createElement(React.StrictMode, null,
      createElement(ConfigProvider, { locale: zhCN },
        createElement(AntdApp, null,
          createElement(RouterProvider, { router }),
        ),
      ),
    ),
  )
}

