
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
  ArrowLeftOutlined,
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
  Card,
} from 'antd'

const { Header, Content, Footer, Sider } = Layout

export const DemoPage = (name = 'demo') => () => {
  const navigate = useNavigate()
  return createElement(Fragment, null,
    createElement('h2', null, createElement(Button, { type: 'link', onClick: () => navigate(-1) }, createElement(ArrowLeftOutlined)), ' ', name),
  )
}

export const Loading = () => {
  return createElement(Spin)
}

export const HeadTitle = ({ title, children }) => {
  useEffect(() => {
    document.title = title
  }, [title])

  return children
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

const identity = d => d

const zh_t_map = {
  'Log in': '登录',
  'Log out': '退出',
  'Please input your Email!': '请输入邮箱!',
  'Email': '邮箱',
  'Please input your Password!': '请输入密码!',
  'Password': '密码',
  'Remember me': '记住我',
  'Back Home': '回到首页',
}

const zh_t = key => zh_t_map[key] || key

const zh_locale = zhCN

export const startApp = async ({
  title = 'LOGO',
  mount = 'root',
  menu_items = [],
  routes = [],
  auther = DefaultAuther,
  t = identity,
  config_provider_options = {},
  lang = navigator.language,
  menu_theme = 'dark',
}) => {

  if (lang === 'zh') {
    t = zh_t
    config_provider_options = { ...config_provider_options, locale: zh_locale }
  }

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
      title: createElement(Link, { to: d.key },
        createElement(HeadTitle, { title: `${d.label} - ${title}` },  d.label),
      ),
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
      createElement(Sider, { theme: menu_theme, breakpoint: 'lg', collapsible: true, collapsed, onCollapse: setCollapsed },
        createElement(Space, { style: { padding: 16, fontSize: '16px', width: 64, height: 64, color: menu_theme === 'dark' ? 'white': 'black', } }, title),
        createElement(Menu, { theme: menu_theme, selectedKeys: [location.pathname], mode: 'inline', items: menu_items, onClick: handleMenuClick }),
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
                    label: t('Log out'),
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
          '©',
          new Date().getFullYear(),
          ' ',
          title,
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
      extra: createElement(Button, { type: 'primary' }, createElement(Link, { to: '/' }, t('Back Home'))),
    })
  }

  const Login = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useAuth()
    const { message } = AntdApp.useApp()
    const [loading, setLoading] = useState(false)
    const {
      token: { colorBgLayout },
    } = theme.useToken()

    if (auth.status === 'checking') return createElement(Loading)
    if (auth.status === 'checked') return createElement(Navigate, { to: '/' })

    const onFinish = async signData => {
      setLoading(true)
      try {
        await auth.auth.login(signData)
        const to = new URLSearchParams(location.search).get('redirect') || '/'
        navigate(to)
      } catch (e) {
        message.warning(t('Login Failed, please try again!'))
      }
      setLoading(false)
    }

    return createElement(Flex, { style: { height: '100vh', background: colorBgLayout }, justify: 'center', align: 'center' },
      createElement(Card, { style: { minWidth: '24rem' } },
        createElement(Form, { initialValues: { autoLogin: true }, onFinish },
          createElement('h1', { style: { textAlign: 'center' } },
            createElement(HeadTitle, { title: `${t('Log in')} - ${title}`}, title)
          ),
          createElement(Form.Item, { name: 'email', rules: [{ required: true, message: t('Please input your Email!'),}] },
            createElement(Input, { prefix: createElement(UserOutlined), placeholder: t('Email') }),
          ),
          createElement(Form.Item, { name: 'password', rules: [{ required: true, message: t('Please input your Password!'),}] },
            createElement(Input.Password, { prefix: createElement(LockOutlined), placeholder: t('Password') }),
          ),
          createElement(Form.Item, { name: 'autoLogin', valuePropName: 'checked' },
            createElement(Checkbox, null, t('Remember me')),
          ),
          createElement(Form.Item, null,
            createElement(Button, { type: 'primary', htmlType: 'submit', loading, block: true }, t('Log in')),
          ),
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
      createElement(ConfigProvider, config_provider_options,
        createElement(AntdApp, null,
          createElement(RouterProvider, { router }),
        ),
      ),
    ),
  )
}

