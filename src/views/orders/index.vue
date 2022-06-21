<template>
  <div>
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col :span="10">
          <el-input v-model="ordersForm.query" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="searchList" @keydown.enter="searchList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border="" stripe style="width: 100%; margin: 20px 0">
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="价格" prop="order_price"></el-table-column>
        <el-table-column label="支付状态" prop="order_price">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template v-slot="scope">
            <el-tag v-if="scope.row.is_send==='否'" type="danger">未发货</el-tag>
            <el-tag v-else type="success">已经发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">{{ scope.row.create_time | dateFilter }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="editFn(scope.row.order_id)"></el-button>
            <el-button icon="el-icon-location-information" size="mini" type="success"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="ordersForm.pagenum"
          :page-size="ordersForm.pagesize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!--  编辑按钮 对话框  -->
    <el-dialog
        :visible.sync="editDialogVisible"
        style="margin-right: 10px"
        title="修改地址"
        width="50%"
        @close="editDialogClose"
    >
      <el-form ref="editRuleRef" :model="editForm" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="订单价格" prop="order_price">
              <el-input v-model.number="editForm.order_price" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="订单数量" prop="order_number">
              <el-input v-model.number="editForm.order_number" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="支付方式" prop="order_pay">
              <el-select v-model="editForm.order_pay" placeholder="请选择支付方式">
                <el-option label="未支付" value="0"></el-option>
                <el-option label="支付宝" value="1"></el-option>
                <el-option label="微信" value="2"></el-option>
                <el-option label="银行卡" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="支付状态" prop="order_pay">
              <el-select v-model="editForm.pay_status" placeholder="请选择支付状态">
                <el-option label="未付款" value="0"></el-option>
                <el-option label="已付款" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParamsFn">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {editOrdersListAPI, getOrdersListAPI, showOrdersListAPI} from '@/api'

export default {
  name: "index",
  data() {
    return {
      ordersList: [],
      ordersForm: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: null,
      editDialogVisible: false,
      editForm: {
        order_price: null,
        order_number: null,
        order_pay: 0, //支付方式 0 未支付 1 支付宝 2 微信 3 银行卡.
        pay_status: 0, //是否付款
      },
      rules: {
        order_price: [
          {required: true, message: '请输入订单价格', trigger: 'blur'},
        ],
        order_number: [
          {required: true, message: '请输入订单数量', trigger: 'blur'},
        ],
        order_pay: [
          {required: true, message: '请选择支付方式', trigger: 'blur'},
        ],
        pay_status: [
          {required: true, message: '请选择支付状态', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    async getOrdersListFn() {
      const {data: res} = await getOrdersListAPI(this.ordersForm)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    searchList() {
      if (this.ordersForm.query.trim().length !== 0) {
        this.getOrdersListFn()
      } else {
        this.ordersForm.query = ''
      }
    },
    handleSizeChange(val) {
      this.ordersForm.pagesize = val
      this.getOrdersListFn()
    },
    handleCurrentChange(val) {
      this.ordersForm.pagenum = val
      this.getOrdersListFn()
    },
    async editFn(id) {
      const {data: res} = await showOrdersListAPI(id)
      this.editForm.order_number = res.data.order_number
      this.editForm.order_price = res.data.order_price
      this.editForm.pay_status = res.data.pay_status
      this.editForm.order_pay = res.data.order_pay
      this.ordersEditId = res.data.order_id
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.editRuleRef.resetFields()
    },
    async editParamsFn() {
      const {data: res} = await editOrdersListAPI(this.ordersEditId, this.editForm)
      console.log(res)
    }
  },
  created() {
    this.getOrdersListFn()
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>