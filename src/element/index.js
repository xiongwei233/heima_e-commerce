import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {Button, Form, FormItem, Input, Message, Row, Select} from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Row)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message