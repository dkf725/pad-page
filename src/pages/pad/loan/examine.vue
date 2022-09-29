<template>
<a-card>
  <!--步骤条-->
  <el-steps :space="200" :active="3" process-status="wait" align-center>
    <el-step v-if="this.role=='平台管理员'" title="平台审批"></el-step>
    <el-step v-if="this.role=='银行管理员'" title="银行审批"></el-step>
    <el-step title="材料审批"></el-step>
    <el-step v-if="this.role=='平台管理员'" title="审批结果"></el-step>
    <el-step v-if="this.role=='银行管理员'" title="放款"></el-step>
  </el-steps>
  {{this.loanInfo.status}}
  <div v-if="this.role=='平台管理员'">
    <div v-if="this.loanInfo.status==1">
      已提交至银行管理员审核，请耐心等待
    </div>
    <div v-if="this.loanInfo.status==2">
      银行管理员审核通过，已放款
    </div>
    <div v-if="this.loanInfo.status==-1">
      银行管理员驳回
    </div>
  </div>
  <div v-if="this.role=='银行管理员'">
    <!--贷款详情-->
    <el-descriptions class="margin-top" title="审核通过,请核对信息后放款" :column="3"  border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          企业用户
        </template>
        {{ loanInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          企业用户编号
        </template>
        {{ loanInfo.cno }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          企业电话
        </template>
        {{ loanInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          贷款银行
        </template>
        {{ loanInfo.bankName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          收款账户
        </template>
        {{ loanInfo.bankNumber }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          开户行
        </template>
        {{ loanInfo.bankType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          贷款金额
        </template>
        {{ loanInfo.amount }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          贷款用途
        </template>
        <span v-if="loanInfo.purpose == 1">个人消费贷款</span>
        <span v-if="loanInfo.purpose == 2">经营贷款</span>
        <span v-if="loanInfo.purpose == 3">按揭贷款</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          创建时间
        </template>
        {{ dateFormat(loanInfo.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          放款类型
        </template>
        <template>
          <el-radio v-model="putType" :label="0">现金</el-radio>
          <el-radio v-model="putType" :label="1">汇款</el-radio>
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          平台所收手续费
        </template>
        <template>
          {{service}}
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          实际放款金额
        </template>
        <template>
          {{money}}
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <el-button type="primary" size="small"  @click="pre()">上一步</el-button>
  <el-button type="primary" size="small" :disabled="disable" @click="put()">{{msg}}</el-button>
</a-card>
</template>

<script>
import {getLoanInfoById} from "@/services/pad/loan/loanInfo";
import {addCredit} from "@/services/pad/credit/credit";

export default {
  name: "examine",
  data(){
    return{
      //贷款编号
      id:'',
      loanInfo:{},
      role:'',
      disable:false,
      msg:'放款',
      count:3,
      //放款类型
      putType:0
    }
  },
  created() {
    this.role = this.$store.getters["account/roles"]
    this.id = this.$route.params.id
    this.getLoanDetail()
  },
  computed:{
    //平台所收手续费
    service:function () {
      return this.loanInfo.amount*0.01;
    },
    money:function () {
      return this.loanInfo.amount - this.service;
    }
  },
  methods:{
    // 时间格式化
    dateFormat: function(date) {
      var t = new Date(date)// row 表示一行数据, createTime 表示要格式化的字段名称
      if(!t){
        return ''
      }
      let year = t.getFullYear()
      let month = this.dateIfAddZero(t.getMonth()+1)
      let day = this.dateIfAddZero(t.getDate())
      return year + '-' + month + '-' + day
    },
    dateIfAddZero : function (time) {
      return time < 10 ? '0'+ time : time
    },
    //获取贷款详情
    getLoanDetail(){
      getLoanInfoById(this.id).then(res=>{
        this.loanInfo = res.data.data.id
      })
    },
    pre(){
      this.$router.push(`/loan/material/${this.id}/${this.loanInfo.cno}`)
    },
    put(){
      let timer = setInterval(()=>{
        if(this.count < 1){
          this.disable = false;
          this.msg = '点击放款';
          this.count = 0;
          clearInterval(timer)
        }else{
          this.disable = true;
          this.msg = '请核对信息，在'+this.count-- + 's后可点击';
        }
      },1000);
      if (this.msg == '点击放款'){
        let params = {
          "lId":this.id,
          "type":this.putType,
          "money":this.money,
          "service":this.service
        }
        addCredit(params).then(res=>{
          this.$message.success(res.data.message)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
