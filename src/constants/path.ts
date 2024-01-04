const path = {
  home: '/',
  role: '/role',
  addRole: '/role/add',
  user: '/user',
  email: '/email',
  addEmail: '/email/add',
  editEmail: '/email/edit/:id',
  category: '/category',
  addCategory: '/category/add',
  editCategory: '/category/:id',
  profile: '/user/profile',
  changePassword: '/user/password',
  login: '/login',
  register: '/register',
  logout: '/logout'
} as const

export default path
