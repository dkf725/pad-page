<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
      <div class="desc">design by 苍盐海F4</div>
    </div>
    <div class="login">
      <el-form ref="form" :model="form" :rules="rules">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
          <el-form-item prop="name">
            <el-input
                autocomplete="autocomplete"
                placeholder="admin"
                v-model="form.name">
              <a-icon slot="prefix" type="user" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                placeholder="11111"
                autocomplete="autocomplete"
                type="password"
                v-model="form.password">
              <a-icon slot="prefix" type="lock" />
            </el-input>
          </el-form-item>
        <div>
          <el-checkbox v-model="form.rememberMe" name="remember-me">记住密码</el-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <el-form-item>
          <el-button style="width: 100%;margin-top: 24px" size="large" @click="onSubmit" type="primary">登录</el-button>
        </el-form-item>
        <!--其他登录方式-->
       <!-- <div>
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" />
          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
        </div>-->
      </el-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
//import {login, getRoutesConfig} from '@/services/user'
import {login} from '@/services/user'
import {setAuthorization} from '@/utils/request'
//import {loadRoutes} from '@/utils/routerUtil'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      error: '',
      form: {
        rememberMe:false
      },
      rules: {//表单校验
        name: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    //登录
    onSubmit () {
      this.$refs["form"].validate((valid) => {
        let qs = require('qs');
        if (valid) {
          login(qs.stringify(this.form)).then(this.afterLogin)
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      console.log(loginRes)
      if (loginRes.code === 200) {
        const {user, permissions, roles} = loginRes.data
        this.setUser(user)
        this.setPermissions(permissions)
        this.setRoles(roles)
        setAuthorization({token: loginRes.data.token, expireAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)})
       /* // 获取路由配置
        getRoutesConfig().then(result => {
          const routesConfig = result.data.data
          loadRoutes(routesConfig)
          this.$router.push('/dashboard/workplace')
          this.$message.success(loginRes.message, 3)
        })*/
        this.$router.push('/dashboard/workplace')
        this.$message.success(loginRes.message, 3)
      } else {
        this.error = loginRes.message
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
