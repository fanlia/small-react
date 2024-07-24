
import 'antd/dist/reset.css'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'

import React, { createElement, Fragment, useState, useEffect, useContext, createContext } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
  Link,
  Outlet,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom"

import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
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
  Space,
  Avatar,
  Dropdown,
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

const KEY = 'access_token'

const AccessToken = {
  set: access_token => access_token ? localStorage.setItem(KEY, access_token) : localStorage.removeItem(KEY),
  get: access_token => localStorage.getItem(KEY),
}

export class Auth {
  constructor(options = {}) {
    this.options = options
    this.user = null
    this.access_token = null
  }

  async me (access_token, autoLogin) {
    if (!access_token) return null
    try {
      this.user = await this.options.fetchUser(access_token)
      this.access_token = access_token
      if (autoLogin) AccessToken.set(access_token)
      return this.user
    } catch (e) {
      // ignore error
      return null
    }
  }

  getUser () {
    return this.user
  }

  async login (signData = {}) {
    const access_token = await this.options.signin(signData)
    return this.me(access_token, signData.autoLogin)
  }

  async logout () {
    AccessToken.set(null)
    this.access_token = null
    this.user = null
  }

  async checkin () {
    if (this.access_token && this.user) {
      return this.user
    }
    const access_token = AccessToken.get()
    return this.me(access_token)
  }
}

const DefaultAuther = {
  fetchUser: async (access_token) => {
    return {
      username: '七妮妮',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    }
  },

  signin: async (signData) => {
    return 'access_token sample'
  },
}

const AutherContext = createContext({})

export const useAuther = () => useContext(AutherContext)

export const startApp = ({
  mount = 'root',
  menu_items = [],
  routes = [],
  auther = DefaultAuther,
}) => {

  const auth = new Auth(auther)

  const useAuth = () => {
    const [ status, setStatus ] = useState('checking')

    useEffect(() => {
      auth.checkin().then((user) => {
        setStatus(user ? 'checked' : 'unchecked')
      })
    }, [])

    return {
      status,
      auth,
    }
  }

  const App = () => {
    const [collapsed, setCollapsed] = useState(false)
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useAuth()

    if (auth.status === 'checking') return createElement(Loading)
    if (auth.status === 'unchecked') {
      const from = encodeURIComponent(location.pathname + location.search)
      const to = `/login?redirect=${from}`
      return createElement(Navigate, { to })
    }

    const bread_items = menu_items.filter(d => d.key === location.pathname).map(d => ({
      title: createElement(Link, { to: d.key }, d.label),
    }))

    const user = auth.auth.getUser()

    const handleAvatar = async ({ key }) => {
      if (key === 'logout') {
        await auth.auth.logout()
        navigate('/login')
      }
    }

    const handleMenuClick = (e) => {
      navigate(e.key)
    }

    return createElement(Layout, { style: { minHeight: '100vh'} },
      createElement(Sider, { collapsible: true, collapsed, onCollapse: setCollapsed },
        createElement(Space, { style: { padding: 24, fontSize: '16px', width: 64, height: 64, color: 'white'} }, 'LOGO'),
        createElement(Menu, { theme: 'dark', selectedKeys: [location.pathname], mode: 'inline', items: menu_items, onClick: handleMenuClick }),
      ),
      createElement(Layout, {},
        createElement(Header, { style: { padding: 0, background: colorBgContainer } },
          createElement(Flex, { justify: 'space-between' },
            createElement('div'),
            user && createElement(Dropdown, {
              menu: {
                items: [
                  {
                    key: 'logout',
                    icon: createElement(LogoutOutlined),
                    label: 'Log out',
                  },
                ],
                onClick: handleAvatar,
              },
            },
              createElement(Space, { style: { marginRight: 24 } },
                createElement(Avatar, { src: user.avatar, icon: !user.avatar && createElement(UserOutlined) }),
                createElement('span', null, user.username),
              ),
            ),
          ),
        ),
        createElement(Content, { style: { margin: '0 16px' } },
          createElement(Breadcrumb, { style: { margin: '16px 0'}, items: bread_items }),
          createElement('div', { style: { padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG } },
            createElement(AutherContext.Provider, { value: auth.auth },
              createElement(Outlet),
            ),
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
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useAuth()
    const { message } = AntdApp.useApp()

    if (auth.status === 'checking') return createElement(Loading)
    if (auth.status === 'checked') return createElement(Navigate, { to: '/' })

    const onFinish = async signData => {
      try {
        await auth.auth.login(signData)
        const to = new URLSearchParams(location.search).get('redirect') || '/'
        navigate(to)
      } catch (e) {
        message.warning('Login Failed, please try again!')
      }
    }

    return createElement(Flex, { style: { height: '100vh' }, justify: 'center', align: 'center' },
      createElement(Form, { initialValues: { autoLogin: true }, onFinish },
        createElement(Form.Item, { name: 'email', rules: [{ required: true, message: 'Please input your Email!',}] },
          createElement(Input, { prefix: createElement(UserOutlined), placeholder: 'Email' }),
        ),
        createElement(Form.Item, { name: 'password', rules: [{ required: true, message: 'Please input your Password!',}] },
          createElement(Input, { prefix: createElement(LockOutlined), placeholder: 'Password' }),
        ),
        createElement(Form.Item, { name: 'autoLogin', valuePropName: 'checked' },
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

