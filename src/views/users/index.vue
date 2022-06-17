<template>
  <div id="app">
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="userSearch" class="input-with-select" clearable
                    placeholder="请输入内容" @clear="clearUser" @keydown.enter.native="searchUser">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <!--  table   -->
      <el-table :data="userList" border stripe style="width: 100%; margin: 20px 0">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="姓名" prop="username" width="160"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="注册时间" prop="create_time">
          <template v-slot="scope">{{ scope.row.create_time | dateFilter }}</template>
        </el-table-column>

        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                       @change="switchFn(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="editUser(scope.row.id)"></el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip content="分配权限" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini" type="warning"
                         @click="rolesShowUser(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination
          :current-page="listFrom.pagenum"
          :page-size="listFrom.pagesize"
          :page-sizes="[5, 10, 20, 30]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 添加用户 dialog弹出框  -->
    <el-dialog
        :visible.sync="addDialogVisible"
        title="提示"
        width="40%"
        @close="closeAddDialog">

      <el-form ref="addFrom" :model="addFrom" :rules="rules" class="demo-ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogFn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 dialog弹出框  -->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="提示"
        width="40%"
        @close="closeEditDialog">

      <el-form ref="editFrom" :model="editFrom" :rules="rules" class="demo-ruleForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editName" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 dialog弹出框  -->
    <el-dialog
        :visible.sync="rolesDialogVisible"
        title="提示"
        width="40%"
        @close="closeRolesDialog">

      <el-form ref="rolesFromRef" :rules="rules" class="demo-ruleForm" label-width="70px">
        <p>当前的用户: {{ roleShowList.username }}</p>
        <p>当前的角色: {{ roleShowList.role_name }}</p>
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
              v-for="item in rolesFrom"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="rolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rolesAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  UsersAPI,
  usersModifyAPI,
  usersAddAPI,
  usersEditAPI,
  usersSubmitAPI,
  usersDeleteAPI,
  showPermissionsAPI, editPermissionsAPI
} from '@/api'

export default {
  name: "users",
  data() {
    //校验
    let checkEmail = (rule, value, callback) => {
      const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (regEmail.test(value)) {
        //验证当前内容，并且返回 布尔值
        //合法邮箱
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    //校验
    let checkMobile = (rule, value, callback) => {
      const regEmail = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/;
      if (regEmail.test(value)) {
        //验证当前内容，并且返回 布尔值
        //合法邮箱
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      userSearch: "",
      userList: [],
      // 请求数据
      listFrom: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total: null,
      //添加用户 dialog弹出框
      addDialogVisible: false,
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改用户 dialog弹出框
      editDialogVisible: false,
      editName: "",
      editFrom: {
        email: "",
        mobile: ""
      },
      editId: null,
      // 分配权限
      roleShowList: {}, //管理员名称和权限
      rolesDialogVisible: false,
      // option
      rolesFrom: [],
      optionValue: "",
      // 表单校验
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 数据列表请求数据
    async getUserList() {
      const {data: res} = await UsersAPI(this.listFrom)
      if (res.meta.status !== 200) return this.$message.error('请求列表数据失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 点击搜索按钮
    searchUser() {
      this.listFrom.query = this.userSearch
      this.getUserList()
    },
    // 点击搜索的清空表单按钮
    clearUser() {
      this.listFrom.query = ''
      this.getUserList()
    },
    // 状态开关按钮
    async switchFn(row) {
      const {data: res} = await usersModifyAPI(row.id, row.mg_state)
      if (res.meta.status !== 200) {
        this.$message.error('修改用户状态失败')
        // 如果请求失败，就返回原来的状态样子
        row.mg_state = !row.mg_state
      }

    },
    // 分页
    handleSizeChange(val) {
      this.listFrom.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.listFrom.pagenum = val
      this.getUserList()
    },

    // 添加用户 dialog弹出框
    addUsers() {
      this.addDialogVisible = true
    },
    closeAddDialog() {
      this.$refs.addFrom.resetFields()
    },
    // 添加用户 dialog弹出框 --- 确定按钮
    addDialogFn() {
      this.$refs.addFrom.validate(async (val) => {
        if (!val) {
          return this.$message.info('请按照要求填写用户信息')
        } else {
          const {data: res} = await usersAddAPI(this.addFrom)
          if (res.meta.status !== 201) return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')
          this.addDialogVisible = false
          await this.getUserList()
        }
      })
    },
    async editUser(id) {
      const {data: res} = await usersEditAPI(id)
      if (res.meta.status !== 200) return this.$message.error('展示修改用户数据请求失败')
      this.editName = res.data.username
      this.editFrom.email = res.data.email
      this.editFrom.mobile = res.data.mobile
      this.editId = res.data.id

      this.editDialogVisible = true
    },
    closeEditDialog() {
      this.$refs.editFrom.resetFields()
    },
    editDialogFn() {
      this.$refs.editFrom.validate(async val => {
        if (!val) return
        const {data: res} = await usersSubmitAPI(this.editId, this.editFrom)
        if (res.meta.status !== 200) return this.$message.error('修改用户数据失败了')
        await this.getUserList()

        this.editDialogVisible = false
      })

    },
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const {data: res} = await usersDeleteAPI(id)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message({type: 'success', message: '删除成功!'})
        await this.getUserList()
      } else {
        this.$message({type: 'info', message: '已取消删除'});
      }
    },
    // 分配权限
    async rolesShowUser(row) {
      this.roleShowList = row
      console.log(row)
      this.rolesDialogVisible = true
      const {data: res} = await showPermissionsAPI()
      this.rolesFrom = res.data
    },
    closeRolesDialog() {
      this.$refs.rolesFromRef.resetFields()
    },
    async rolesAdd() {
      const {data: res} = await editPermissionsAPI(this.roleShowList.id, {rid: this.optionValue})
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      await this.getUserList()
      this.rolesDialogVisible = false
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>