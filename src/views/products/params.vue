<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!--   步骤条   -->
      <el-alert show-icon title="只允许为第三级分类设置相关参数！" type="warning"></el-alert>
      <el-form style="margin: 20px 0">
        <el-form-item label="请选择商品分类">
          <el-cascader
              v-model="cateId"
              :options="cateList"
              :props="cateProps"
              @change="cateChangeFn"></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" type="card" @tab-click="addTable">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isShow" size="mini" style="margin-bottom: 20px" type="primary" @click="addParams">
            添加参数
          </el-button>
          <el-table :data="paramsList" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <div style="margin: 10px 35px">
                  <el-tag v-for="(tagItem,index) in scope.row.attr_vals" :key="index" closable
                          disable-transitions @close="closeTag(tagItem,scope.row)">
                    {{ tagItem }}
                  </el-tag>
                  <el-input
                      v-if="scope.row.inputVisible"
                      ref="saveTagInput"
                      v-model="scope.row.inputValue"
                      class="input-new-tag"
                      size="small"
                      style="width: 100px"
                      @blur="handleInputConfirm(scope.row)"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="动态参数" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button icon="el-icon-edit" size="mini" type="primary" @click="editParams(scope.row)">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isShow" size="mini" style="margin-bottom: 20px" type="primary" @click="addParams">添加属性
          </el-button>
          <el-table :data="onlyList" border stripe style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <div style="margin: 10px 35px">
                  <el-tag v-for="(tagItem,index) in scope.row.attr_vals" :key="index" closable
                          disable-transitions @close="closeTag(tagItem,scope.row)">
                    {{ tagItem }}
                  </el-tag>
                  <el-input
                      v-if="scope.row.inputVisible"
                      ref="saveTagInput"
                      v-model="scope.row.inputValue"
                      class="input-new-tag"
                      size="small"
                      style="width: 100px"
                      @blur="handleInputConfirm(scope.row)"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </div>

              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="动态参数" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button icon="el-icon-edit" size="mini" type="primary" @click="editParams(scope.row)">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--  添加参数对话框  -->
    <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
    >
      <el-form ref="addRuleRef" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item :label="this.activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParamsFn">确 定</el-button>
  </span>
    </el-dialog>

    <!--  编辑按钮 对话框  -->
    <el-dialog
        :title="'添加'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
    >
      <el-form ref="editRuleRef" :model="editForm" :rules="rules" label-width="80px">
        <el-form-item :label="this.activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParamsFn">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {addAttributesAPI, categoriesAPI, categoriesAttrListAPI, deleteAttributesAPI, editAttributesAPI} from '@/api'

export default {
  name: "params",
  data() {
    return {
      activeName: "many",
      // 级联选择框v-module绑定的数据
      cateId: [],
      // 级联选择器数据源
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态 属性的数据
      paramsList: [],
      // 静态 属性的数据
      onlyList: [],
      rules: {
        attr_name: [
          {required: true, message: '请输入动态参数', trigger: 'blur'},
          {min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'blur'}
        ],
      },
      addDialogVisible: false,
      addForm: {
        attr_name: ""
      },
      // 编辑
      editDialogVisible: false,
      editForm: {
        attr_name: ""
      },
      editId: null,
    }
  },
  methods: {
    async cateListFn() {
      const {data: res} = await categoriesAPI()
      if (res.meta.status !== 200) return this.$message.error('级联选择器数据请求失败')
      this.cateList = res.data
    },
    // 级联选择器
    cateChangeFn() {
      this.getParamsDate()
    },

    /*
    *  获取参数的请求API
     */
    async getParamsDate() {
      if (this.cateId.length !== 3) {
        this.cateId = []
        this.paramsList = []
        this.onlyList = []
        return
      }
      // 拿到三级分类的ID
      const {data: res} = await categoriesAttrListAPI(this.parameterId, {sel: this.activeName})
      if (res.meta.status !== 200) return this.$message.error('分类参数请求失败')
      // 把attr_vals的数据分割成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制tag的显示和隐藏
        item.inputValue = ''
        item.inputVisible = false
      })
      // 动态参数/属性存放不同的数组
      if (this.activeName === 'many') {
        this.paramsList = res.data
      } else {
        this.onlyList = res.data
      }
      console.log(res.data)
    },
    //tab切换
    addTable() {
      console.log(this.activeName)
      this.getParamsDate()
    },
    // 添加参数/属性按钮
    addParams() {
      this.addDialogVisible = true
    },
    addDialogClose() {
      this.$refs.addRuleRef.resetFields()
    },
    // 添加参数的请求
    async addParamsFn() {
      const {data: res} = await addAttributesAPI(this.parameterId, {
        attr_name: this.addForm.attr_name,
        attr_sel: this.activeName,
      })
      if (this.activeName === 'many') {
        this.paramsList.push(res.data)
      } else {
        this.onlyList.push(res.data)
      }
      this.addDialogVisible = false
    },
    // 编辑按钮
    editParams(row) {
      console.log(row)
      this.editForm.attr_name = row.attr_name
      this.editId = row.attr_id
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.editRuleRef.resetFields()
    },
    async editParamsFn() {
      const {data: res} = await editAttributesAPI(this.parameterId, this.editId, {
        attr_name: this.editForm.attr_name,
        attr_sel: this.activeName
      })
      this.getParamsDate()
      this.editDialogVisible = false
    },
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const {data: res} = await deleteAttributesAPI(this.parameterId, attr_id)
        if (res.meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('删除成功')
        this.getParamsDate()
      } else {
        this.$message.info('取消了删除')
      }
    },
    // tag标签
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点或者按下enter
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue.trim());
      }
      row.inputVisible = false;
      row.inputValue = '';
      this.savaAttr(row)
    },

    async savaAttr(row) {
      let str = row.attr_vals.join(',')
      const {data: res} = await editAttributesAPI(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: str
      })
      if (res.meta.status !== 200) return this.$message.error('添加参数项失败')
      console.log(res.data)
    },

    closeTag(index, row) {
      //通过indexof查找当前点击的tag标签 并删掉
      row.attr_vals.splice(row.attr_vals.indexOf(index), 1)
      this.savaAttr(row)
    }
  },
  created() {
    this.cateListFn()
  },
  computed: {
    // 判断当前 添加属性/参数 按钮的禁用
    // true 是禁用，false是不禁言
    isShow() {
      if (this.cateId.length !== 3) return true
      return false
    },
    // 判断当前及联选择器，是否选择三级分类
    parameterId() {
      if (this.cateId.length === 3) {
        return this.cateId[this.cateId.length - 1]
      }
    },
    titleText() {
      if (this.activeName === 'many') return "动态参数"
      return '静态属性'
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 8px;
}
</style>