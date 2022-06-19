<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button class="el-icon-plus" type="primary" @click="addCategories">添加分类</el-button>
        </el-col>
      </el-row>
      <zk-table
          :columns="columns"
          :data="categoriesList"
          :expand-type="false"
          :selection-type='false'
          border
          index-text="#"
          show-index
          style="margin: 20px 0"
      >
        <!--    是否有效    -->
        <template slot="isOk" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:#67C23A"></i>
          <i v-else class="el-icon-error" style="color:#F56C6C"></i>
        </template>

        <!--    排序    -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <!--    操作    -->
        <template slot="operation" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="editCategories(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeCategories(scope.row.cat_id)">删除
          </el-button>
        </template>

      </zk-table>
      <!--   分页   -->
      <el-pagination
          :current-page="categoriesForm.pagenum"
          :page-size="categoriesForm.pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 编辑分类 dialog弹出框  -->
    <el-dialog
        :visible.sync="editDialogVisible"
        title="编辑分类"
        width="40%"
        @close="closeEditRolesDialog">
      <el-form ref="editRolesFromRef" :model="editFrom" :rules="rules" class="demo-ruleForm" label-width="80px">
        <el-form-item label="添加角色" prop="cat_name">
          <el-input v-model="editFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分类 dialog弹出框  -->
    <el-dialog
        :visible.sync="addDialogVisible"
        title="添加分类"
        width="40%"
        @close="closeAddDialog">
      <el-form ref="addFromRef" :model="addFrom" :rules="rules" class="demo-ruleForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addFrom.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <el-cascader
              v-model="classValue"
              :options="classList"
              :props="classProps"
              clearable
              style="width: 100%"
              @change="changeClass">
          </el-cascader>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesFn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>


import {categoriesAPI, deleteCategoriesAPI, editCategoriesAPI, categoriesIdAPI, addCategoriesAPI} from '@/api'

import ZkTable from 'vue-table-with-tree-grid'

export default {
  name: "categories",
  components: {
    ZkTable,
  },
  data() {
    return {
      categoriesList: [],
      total: null,
      categoriesForm: {
        pagenum: 1,
        pagesize: 10,
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          template: 'isOk',
          // 表示定义为模板列
          type: 'template',
        },
        {
          label: '排序',
          template: 'level',
          // 表示定义为模板列
          type: 'template',
        },
        {
          label: '操作',
          template: 'operation',
          // 表示定义为模板列
          type: 'template',
        },
      ],
      // 编辑分类
      editDialogVisible: false,
      editFrom: {},
      // 添加分类
      addDialogVisible: false,
      addFrom: {
        // 输入框绑定的值
        cat_name: "",
        // 分类父 ID
        cat_pid: 0,
        // 分类层级 不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0,
      },
      // 表单校验
      rules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
      },
      // 添加分类
      classValue: "",
      classList: [],
      classProps: {
        expandTrigger: 'hover',
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true
      }
    }
  },
  methods: {
    async categoriesListFn() {
      const {data: res} = await categoriesAPI(this.categoriesForm)
      if (res.meta.status !== 200) return this.$message.error('品分类数据列表失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 编辑
    async editCategories(row) {
      const {data: res} = await categoriesIdAPI(row.cat_id)
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    closeEditRolesDialog() {
      this.$refs.editRolesFromRef.resetFields()
    },
    editRolesFn() {
      this.$refs.editRolesFromRef.validate(async val => {
        if (!val) return
        const {data: res} = await editCategoriesAPI(this.editFrom.cat_id, {
          cat_name: this.editFrom.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error('分类名称更新失败')
        this.editFrom = res.data
        await this.categoriesListFn()
        this.editDialogVisible = false
      })
    },
    // 删除
    async removeCategories(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === "confirm") {
        const {data: res} = await deleteCategoriesAPI(id)
        console.log(res.data)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message({type: 'success', message: '删除成功!'})
        await this.categoriesListFn()
      } else {
        this.$message({type: 'info', message: '已取消删除'});
      }
    },
    // 分页
    handleSizeChange(val) {
      this.categoriesForm.pagesize = val
      this.categoriesListFn()
    },
    handleCurrentChange(val) {
      this.categoriesForm.pagenum = val
      this.categoriesListFn()
    },
    // 添加分类
    async addCategories() {
      const {data: res} = await categoriesAPI()
      if (res.meta.status !== 200) return this.$message.error('品分类数据列表失败')
      this.classList = res.data
      console.log(this.classList)

      this.addDialogVisible = true

    },
    // 关闭添加分类对话框
    closeAddDialog() {
      this.$refs.addFromRef.resetFields()
      this.classValue = []
      this.addFrom.cat_pid = 0
      this.addFrom.cat_level = 0
    },
    // 级联选择器的change事件
    changeClass() {
      console.log(this.classValue)
      // 如果选中了数据，那么length就>0, 反之就没有选中任何父级分类
      if (this.classValue.length > 0) {
        // 拿到父级分类的ID，父级分类id就是当前选择中拿到的数组最后一个
        this.addFrom.cat_pid = this.classValue[this.classValue.length - 1]
        // 分类的等级: 一级分类是0，二级分类是1,三级分类是2,跟他的length一样，所以就用这个
        this.addFrom.cat_level = this.classValue.length - 1
        console.log(this.addFrom)
        return
      } else {
        // 如果没选中，分类等级和父级id归0
        this.addFrom.cat_pid = 0
        this.addFrom.cat_level = 0
      }
    },
    // 添加确认按钮
    addRolesFn() {
      console.log(this.addFrom)
      this.$refs.addFromRef.validate(async val => {
        if (!val) return
        const {data: res} = await addCategoriesAPI(this.addFrom)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.addDialogVisible = false
        await this.categoriesListFn()
      })
    }
  },
  created() {
    this.categoriesListFn()
  }

}
</script>

<style scoped>

</style>