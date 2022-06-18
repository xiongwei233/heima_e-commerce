<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe style=" margin: 20px 0">
        <el-table-column style="padding: 20px 50px" type="expand">

          <template v-slot="scope">
            <div class="tabClassTop" style="padding: 20px 50px">
              <!--    一级权限      -->
              <el-row v-for="(item,index) in scope.row.children" :key="item.id"
                      :class="['tabBottom',index===0?'tabTop':'']">
                <el-col :span="5" class="tagOne">
                  <el-tag closable @close="removeRightTag(scope.row,item.id)">{{ item.authName }}</el-tag>
                  <i class="el-icon-caret-right" style="padding-left: 10px"></i>
                </el-col>

                <!--      二级和三级权限      -->
                <el-col :span="19">
                  <el-row v-for="(item2,index) in item.children" :key="item2.id"
                          :class="[index===0?'':'tabTop']">
                    <el-col :span="6">
                      <el-tag closable type="success" @close="removeRightTag(scope.row,item2.id)">{{
                          item2.authName
                        }}
                      </el-tag>
                      <i class="el-icon-caret-right" style="padding-left: 10px"></i>
                    </el-col>

                    <el-col :span="18">
                      <el-tag v-for="item3 in item2.children" :key="item3.id" closable type="warning"
                              @close="removeRightTag(scope.row,item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>

              </el-row>
            </div>

          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" min-width="100">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="editRoles(scope.row)">编辑</el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeRoles(scope.row.id)">删除</el-button>
            <el-button icon="el-icon-setting" size="mini" type="warning" @click="settingRoles(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 dialog弹出框  -->
    <el-dialog
        :visible.sync="rolesDialogVisible"
        title="添加角色"
        width="40%"
        @close="closeRolesDialog">

      <el-form ref="rolesFromRef" :model="rolesFrom" :rules="rules" class="demo-ruleForm" label-width="80px">
        <el-form-item label="添加角色" prop="roleName">
          <el-input v-model="rolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesFrom.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="rolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 dialog弹出框  -->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="添加角色"
        width="40%"
        @close="closeEditRolesDialog">

      <el-form ref="editRolesFromRef" :model="editFrom" :rules="rules" class="demo-ruleForm" label-width="80px">
        <el-form-item label="添加角色" prop="roleName">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 dialog弹出框  -->
    <el-dialog
        :visible.sync="settingDialogVisible"
        title="分配权限"
        width="40%"
        @close="closeSettingRolesDialog">

      <el-tree
          ref="treeRef"
          :data="treeForm"
          :default-checked-keys="checkedKey"
          :props="treeProps"
          default-expand-all
          node-key="id"
          show-checkbox>
      </el-tree>

      <span slot="footer" class="dialog-footer">
          <el-button @click="settingDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  editRolesAPI,
  permissionsRolesAPI,
  removeRolesAPI,
  removeTagRolesAPI,
  rightsAPI,
  rolesAPI,
  showPermissionsAPI
} from '@/api'

export default {
  name: "roles",
  data() {
    return {
      rolesList: [],
      // 添加
      rolesDialogVisible: false,
      rolesFrom: {
        roleName: "",
        roleDesc: ""
      },
      // 编辑
      editDialogVisible: false,
      editFrom: {
        roleName: "",
        roleDesc: ""
      },
      editFromId: "",
      // 分配权限
      settingDialogVisible: false,
      treeForm: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认展开的节点的 key 的数组
      checkedKey: [101],
      rolesId: "",
      // 表单校验
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入添加角色', trigger: 'blur'},
          {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    async rolesListFn() {
      const {data: res} = await showPermissionsAPI()
      if (res.meta.status !== 200) return this.$message.error('角色列表数据请求失败')
      this.rolesList = res.data
    },
    addRoles() {
      this.rolesDialogVisible = true
    },
    addRolesFn() {
      this.$refs.rolesFromRef.validate(async val => {
        if (!val) return
        const {data: res} = await rolesAPI(this.rolesFrom)
        if (res.meta.status !== 201) return this.$message.error('角色列表数据请求失败')
        await this.rolesListFn()
        this.rolesDialogVisible = false
      })
    },
    closeRolesDialog() {
      this.$refs.rolesFromRef.resetFields()
    },
    // 编辑
    editRoles(row) {
      this.editFrom.roleDesc = row.roleDesc
      this.editFrom.roleName = row.roleName
      this.editFromId = row.id
      this.editDialogVisible = true
    },
    editRolesFn() {
      this.$refs.editRolesFromRef.validate(async val => {
        if (!val) return
        const {data: res} = await editRolesAPI(this.editFromId, this.editFrom)
        if (res.meta.status !== 200) return this.$message.error('修改角色列表失败')
        this.editDialogVisible = false
        await this.rolesListFn()
      })
    },
    closeEditRolesDialog() {
      this.$refs.editRolesFromRef.resetFields()
    },
    // 删除
    async removeRoles(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该家角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      if (confirmResult === 'confirm') {
        this.$message.success('删除成功')
        const {data: res} = await removeRolesAPI(id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        await this.rolesListFn()
      } else {
        this.$message.info('取消了删除')
      }
    },
    // 分配权限
    async settingRoles(row) {
      this.rolesId = row.id
      const {data: res} = await rightsAPI('tree')
      if (res.meta.status !== 200) return this.$message.error('分配权限数据获取失败')
      this.treeForm = res.data
      // 调用递归函数 获取三级节点id
      // row是一个对象data，this.checkedKey是储存id的数组
      this.getTreeKeys(row, this.checkedKey)
      this.settingDialogVisible = true
    },

    // 通过递归的形式， 获取角色下所有的三级权限的id，并保持到checkedKey数组
    getTreeKeys(node, arr) {
      // 如果当前 node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 否则 循环遍历当前节点的子级 (arr就是一个存储数据结果的容器,没有其他作用)
      node.children.forEach(item => {
        this.getTreeKeys(item, arr)
      })
    },

    closeSettingRolesDialog() {
      this.checkedKey = []
    },
    // 分配权限对话框，确定按钮(发起请求)
    async allotRight() {
      // show-checkbox就是那个tree的复选框选中之后就为true
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      let CheckedKeys = this.$refs.treeRef.getCheckedKeys()
      // 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      let HalCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
      // 合并数组
      const keys = [...CheckedKeys, ...HalCheckedKeys]

      // 转为字符串 (因为当前的接口要求我传字符串)
      const idStr = keys.join(",")
      // 发请求
      const {data: res} = await permissionsRolesAPI(this.rolesId, {rids: idStr})
      if (res.meta.status !== 200) return this.$message.error('分配权限数据更新失败')
      this.settingDialogVisible = false
      await this.rolesListFn()
    },
    async removeRightTag(row, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(res => res)
      if (confirmResult === 'confirm') {
        this.$message.success('删除成功')
        const {data: res} = await removeTagRolesAPI(row.id, rightId)
        if (res.meta.status !== 200) return this.$message.error('删除权限失败')
        row.children = res.data
      } else {
        this.$message.info('取消了删除')
      }

    }
  },
  created() {
    this.rolesListFn()
  }
}
</script>

<style scoped>
.el-tree {
  width: 50%;
}

.el-tag {
  margin: 7px;
}

.el-row {
  display: flex;
  align-items: center;
}

.el-col {
  margin: 6px 0;
}

.tabTop {
  border-top: 1px solid #eee;
}

.tabBottom {
  border-bottom: 1px solid #eee;
}


</style>