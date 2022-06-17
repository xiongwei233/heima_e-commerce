import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
    Aside, Avatar, Breadcrumb, BreadcrumbItem,
    Button, Card, Col,
    Container, Dialog, Dropdown, DropdownItem, DropdownMenu,
    Form,
    FormItem,
    Header,
    Input, Main, Menu, MenuItem, MenuItemGroup,
    Message, Pagination,
    Row, Option,
    Select, Submenu, Switch, Table, TableColumn, Tooltip, MessageBox, Cascader
} from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Row)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Avatar)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Option)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
