<template>
  <div class="login_contentBox">
    <div class="login_box">
      <div class="avater_box"><img alt="" src="../../assets/logo.png"></div>
      <el-form ref="ruleForm" :model="loginForm" :rules="rules" class="demo-ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-lock_fill" type="password"></el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {LoginAPI} from "@/api"

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单校验
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 重置按钮
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 登录按钮
    loginBtn() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          const {data: res} = await LoginAPI({
            username: this.loginForm.username,
            password: this.loginForm.password
          })
          if (res.meta.status !== 200) return this.$message.error("登录失败")
          this.$message.success("登录成功")
          window.sessionStorage.setItem("token", res.data.token)
          await this.$router.push("/home")
        } else {
          return false;
        }
      });

    }
  },
  created() {

  }
}
</script>

<style lang="less" scoped>
.login_contentBox {
  width: 100%;
  height: 100%;
  background-color: @background-login;
  background: url("https://imgapi.cn/api.php?fl=dongman&gs=images");

  .login_box {
    width: 500px;
    height: 320px;
    box-shadow: 0 0 7px 5px rgba(0, 0, 0, 0.1);
    background-color: @background-login;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;

    .avater_box {
      border: 6px solid;
      border-color: @color;
      background-color: @background-login;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      overflow: hidden;
      text-align: center;
      box-shadow: 0 0 7px 5px rgba(0, 0, 0, 0.2);
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      top: -40px;

      img {
        margin-top: 24px;
        width: 90px;
        height: 90px;
      }
    }

    .demo-ruleForm {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 10px 30px;
      box-sizing: border-box;

      .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>