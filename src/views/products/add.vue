<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!--   步骤条   -->
      <el-alert center show-icon title="添加商品信息" type="info"></el-alert>
      <el-steps :active="activeIndex - 0" align-center finish-status="success" style="margin: 30px 0">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tabs 标签页    -->

      <el-tabs v-model="activeIndex" :before-leave="beforeTable" tab-position="left" @tab-click="tabClickFn">
        <el-tab-pane label="基本信息" name='0'>
          <el-form ref="basicFormRef" :model="basicForm" :rules="rules" label-position="top" label-width="90px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="basicForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="basicForm.goods_price" min="0" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="basicForm.goods_number" min="0" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="basicForm.goods_weight" min="0" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                  v-model="basicForm.goods_cat"
                  :options="cateForm"
                  :props="cateProps"
                  style="width: 100%"
                  @change="cateChange"
              ></el-cascader>
            </el-form-item>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name='1'>
          <el-form>
            <el-form-item v-for="item in productsManyList" :key="item.attr_id">
              <span>{{ item.attr_name }}</span>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb,index) in item.attr_vals" :key="index" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name='2'>
          <el-form label-position="top" label-width="60px">
            <el-form-item v-for="item in attributeFrom" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="商品图片" name='3'>
          <el-upload
              :headers="uploadHeaders"
              :on-preview="updatePreview"
              :on-remove="updateRemove"
              :on-success="updateSuccess"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              class="upload-demo"
              drag
              list-type="picture"
              multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name='4'>
          <quill-editor v-model="basicForm.goods_introduce"
          >
          </quill-editor>
          <el-button style="margin-top: 20px" type="primary" @click="addProducts">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
        :visible.sync="updateDialogVisible"
        title="图片预览"
        width="50%"
    >
      <div style="width: 100%"><img :src="showImage" alt="" style="width: 100%"></div>
    </el-dialog>
  </div>
</template>

<script>
import {addProductsAPI, categoriesAPI, categoriesAttrListAPI} from '@/api'

// 编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
// 深拷贝
let _ = require('lodash');

export default {
  name: "add",
  components: {
    quillEditor
  },
  data() {
    return {
      // 步骤条切换
      activeIndex: 0,
      //基本信息表单
      basicForm: {
        goods_name: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: [],
        // 图片的数组
        pics: [],
        attrs: []
      },
      // 及联选择器的分类数据
      cateForm: [],
      cateProps: {
        expandTrigger: 'hover',
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 上传图片需要的token
      uploadHeaders: {Authorization: sessionStorage.getItem('token')},
      // 表单校验
      rules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请填写价格', trigger: 'blur'},
        ],
        goods_number: [
          {required: true, message: '请填写数量', trigger: 'blur'},
        ],
        goods_weight: [
          {required: true, message: '请填写商品重量', trigger: 'blur'},
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'},
        ],
      },
      // 商品参数
      productsManyList: [],
      // 商品属性
      attributeFrom: [],
      // 图片预览对话框
      updateDialogVisible: false,
      // 展示图片路径
      showImage: "",
      goods_introduce: ""

    }
  },
  methods: {
    async getCateFormFn() {
      const {data: res} = await categoriesAPI()
      this.cateForm = res.data
      // console.log(this.cateForm)
    },
    cateChange() {
      // 把数组转为字符串，因为接口接受的是字符串
      // console.log(this.cateForm.goods_cat.toString())
      // 根据接口来的，如果没选中三级分类，就把选中的数据重置
      if (this.basicForm.goods_cat.length !== 3) {
        this.basicForm.goods_cat = []
        this.$message.error('请选择三级分类')
      }
    },
    // 切换标签之前的钩子
    beforeTable(activeName, oldActiveName) {
      // console.log(activeName) //离开时的标签页的name
      // console.log('进入的标签页的name：' + oldActiveName) //进入的标签页的name
      // 当进入的标签页的name=‘0’, 或者及联选择器没有选中三级分类
      if (oldActiveName === '0' && this.basicForm.goods_cat.length !== 3 && this.basicForm.goods_name.length === 0) {
        this.$message.error('用户名或者分类没添加')
        // 阻止切换
        return false
      }
    },
    async tabClickFn() {
      // 表示访问的是 商品参数(动态参数)
      if (this.activeIndex === '1') {
        // 这个接口接受的参数: 比如说我分类选中了三级分类，id为:[1, 3, 6,]
        // 这个接口他只接受三级分类，就是6,他只需要一个6就行。
        const {data: res} = await categoriesAttrListAPI(this.cateId, {sel: 'many'})
        if (res.meta.status !== 200) return this.$message.error('参数列表请求失败')
        res.data.forEach(item => {
          // item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          // 如果没有参数
          if (item.attr_vals.length === 0) {
            // 返回空数组
            item.attr_vals = []
          } else {
            // 返回分割后的数组
            item.attr_vals = item.attr_vals.split(',')
          }
        })
        this.productsManyList = res.data
        // console.log(this.productsManyList)
      } else if (this.activeIndex === '2') {
        const {data: res} = await categoriesAttrListAPI(this.cateId, {sel: 'only'})
        if (res.meta.status !== 200) return this.$message.error('商品属性列表请求失败')
        this.attributeFrom = res.data
        console.log(this.attributeFrom)
      }

    },
    // 图片上传的操作-还没发起请求
    updateSuccess(response) {
      const picInfo = {pic: response.data.tmp_path}
      this.basicForm.pics.push(picInfo)
    },
    // 图片移出-还没发起请求
    updateRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.basicForm.pics.findIndex(x => x.pic === filePath)
      this.basicForm.pics.splice(i, 1)
    },
    // 图片预览
    updatePreview(file) {
      this.showImage = file.response.data.url

      this.updateDialogVisible = true
      console.log(file)
    },
    // 添加商品按钮
    addProducts() {
      this.$refs.basicFormRef.validate(async val => {
        if (!val) return
        // 这里要对this.basicForm进行深拷贝，
        // 应为这个添加商品的 及联选择器绑定的是一个数组，但是上传的时候接口需要的是字符串
        // 如果我们直接下面的修改，那么就会报错:及联选择器支持的是数组，
        // this.basicForm.goods_cat = this.basicForm.goods_cat.join(',')
        // 所以我们在这里对数据进行一下深拷贝，那么他们就是2个数据，互不干扰
        let addForm = _.cloneDeep(this.basicForm)
        // 处理商品参数
        this.productsManyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join('')
          }
          this.basicForm.attrs.push(newInfo)
        })
        // 处理商品属性
        this.attributeFrom.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.basicForm.attrs.push(newInfo)
        })
        addForm.attrs = this.basicForm.attrs
        console.log(addForm)

        // 把深拷贝过后的数据里面的goods_cat数组转为字符串
        addForm.goods_cat = addForm.goods_cat.join(',')
        const {data: res} = await addProductsAPI(addForm)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        // 跳转回商品列表页面
        // this.$router.push('/goods')
      })


    }
  },

  created() {
    this.getCateFormFn()
  },
  computed: {
    cateId() {
      // console.log(this.basicForm.goods_cat)
      if (this.basicForm.goods_cat.length === 3) {
        return this.basicForm.goods_cat[2]
      }
      return null
    },
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}


</style>