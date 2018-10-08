import { find } from 'lodash'
import { HomePage, LoginPage, LogoutPage, OrdersPage } from 'components'

const me = {}
const ROUTES = [
  {
    name: 'home',
    text: 'Home',
    path: '/',
    props: {
      exact: true,
      component: HomePage
    }
  },
  {
    name: 'login',
    text: 'Login',
    path: '/login',
    props: {
      component: LoginPage
    }
  },
  {
    name: 'orders',
    text: 'Orders',
    path: '/orders',
    props: {
      component: OrdersPage
    }
  },
  {
    name: 'change-password',
    text: 'Change Password',
    path: '/change-password'
  },
  {
    name: 'logout',
    text: 'Logout',
    path: '/logout',
    props: {
      component: LogoutPage
    }
  },
  {
    name: 'about',
    text: 'About',
    path: '/about'
  }
]

Object.freeze(ROUTES)
me.get = () => ROUTES
me.getByPath = path => find(ROUTES, { path }) || {}

export default me
