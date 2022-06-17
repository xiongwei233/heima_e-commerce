import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
    Aside, Avatar,
    Button,
    Container, Dropdown, DropdownItem, DropdownMenu,
    Form,
    FormItem,
    Header,
    Input, Main, Menu, MenuItem, MenuItemGroup,
    Message,
    Row,
    Select, Submenu,
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

Vue.prototype.$message = Message