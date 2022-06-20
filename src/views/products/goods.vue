<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="goodsSearch" class="input-with-select" clearable
                    placeholder="请输入内容" @clear="clearProducts" @keydown.enter.native="searchProducts">
            <el-button slot="append" icon="el-icon-search" @click="searchProducts"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addProducts">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   表格数据   -->
      <el-table :data="goodsList" border style="margin: 20px 0">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" min-width="300" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格/元" prop="goods_price" width="100"></el-table-column>
        <el-table-column label="商品重量" prop="goods_number" width="100"></el-table-column>
        <el-table-column label="商品数量" prop="goods_weight" width="100"></el-table-column>
        <el-table-column label="是否促销" prop="is_promote">
          <template v-slot="scope">
            <el-tag v-if="scope.row.is_promote" type="warning">促销中</el-tag>
            <el-tag v-else type="info">暂无促销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template v-slot="scope">{{ scope.row.upd_time | dateFilter }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="140">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary"
                       @click="editGoods(scope.row.goods_id)"></el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger"
                       @click="removeGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--   分页   -->
      <el-pagination
          :current-page="goodsForm.pagenum"
          :page-size="goodsForm.pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 修改商品用户 dialog弹出框  -->
    <el-dialog
        :visible.sync="editGoodsDialogVisible"
        title="修改商品信息"
        width="40%"
        @close="closeEditGoodsDialog">

      <el-form ref="editGoodsFromRef" :model="editGoodsFrom" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsFrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="editGoodsFrom.goods_price" min="0" type="number"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="editGoodsFrom.goods_number" min="0" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="editGoodsFrom.goods_weight" min="0" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsFn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {goodsListAPI, goodsListIdAPI, goodsListIdDeleteAPI, goodsListIdPutAPI} from '@/api'

export default {
  name: "goods",
  data() {
    return {
      goodsSearch: "",
      goodsList: [],
      goodsForm: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: null,
      // 修改商品
      editGoodsDialogVisible: false,
      editGoodsFrom: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: [],
        attrs: []
      },
      goodsId: null,
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
      }
    }
  },
  methods: {
    // 列表数据
    async getGoodsListFn() {
      const {data: res} = await goodsListAPI(this.goodsForm)
      if (res.meta.status !== 200) return this.$message.error('请求权限列表数据失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(val) {
      this.goodsForm.pagesize = val
      this.getGoodsListFn()
    },
    handleCurrentChange(val) {
      this.goodsForm.pagenum = val
      this.getGoodsListFn()
    },
    // 搜索输入框
    clearProducts() {
      this.goodsForm.query = this.goodsSearch
      this.getGoodsListFn()
    },
    searchProducts() {
      this.goodsForm.query = this.goodsSearch
      this.getGoodsListFn()
    },
    // 添加商品
    addProducts() {
      this.$router.push("/goods/add")
    },
    // 修改商品
    async editGoods(goods_id) {
      const {data: res} = await goodsListIdAPI(goods_id)
      if (res.meta.status !== 200) return this.$message.error('获取修改商品数据失败')
      this.editGoodsFrom.goods_name = res.data.goods_name
      this.editGoodsFrom.goods_price = res.data.goods_price
      this.editGoodsFrom.goods_number = res.data.goods_number
      this.editGoodsFrom.goods_weight = res.data.goods_weight
      this.goodsId = res.data.goods_id

      this.editGoodsDialogVisible = true
    },
    closeEditGoodsDialog() {
      this.$refs.editGoodsFromRef.resetFields()
    },
    editGoodsFn() {
      this.$refs.editGoodsFromRef.validate(async val => {
        if (!val) return
        this.$message.error('接口有问题，暂不发送请求')
        await this.getGoodsListFn()
        this.editGoodsDialogVisible = false
      })
    },
    // 删除商品
    async removeGoods(goods_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === "confirm") {
        const {data: res} = await goodsListIdDeleteAPI(goods_id)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message({type: 'success', message: '删除成功!'})
        await this.getGoodsListFn()
      } else {
        this.$message({type: 'info', message: '已取消删除'});
      }
    }
  },
  created() {
    this.getGoodsListFn()
  }
}
</script>

<style scoped>
</style>