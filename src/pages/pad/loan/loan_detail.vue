<template>
<a-card>
  <!--步骤条-->
  <el-steps :space="200" :active="1" process-status="wait" align-center>
    <el-step title="贷款审批"></el-step>
    <el-step title="材料审批"></el-step>
    <el-step title="银行审批"></el-step>
    <el-step title="放款"></el-step>
  </el-steps>
  <br/>
  <!--贷款详情-->
  <el-descriptions class="margin-top" title="贷款详情" :column="3"  border>
    <template slot="extra">
      <el-button type="danger" size="small"  @click="open()">驳回</el-button>
    </template>
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
        <i class="el-icon-user"></i>
        企业积分
      </template>
      {{ loanInfo.value }}
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
        <i class="el-icon-tickets"></i>
        审核状态
      </template>
      <el-tag :type="(loanInfo.status == '0' ? 'info' : (loanInfo.status == '1' ? 'success' :'danger'))" size="mini">
        {{ loanInfo.status == '0' ? '未审核' : (loanInfo.status == '1' ? '审核通过' :'审核失败') }}
      </el-tag>
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

    <!--操作-->
    <el-descriptions-item label="审核操作" prop="status" :span="3">
      <template slot="label">
        <i class="el-icon-open"></i>
        审核操作
      </template>
      <template>
        <el-switch
            v-model="loanInfo.status"
            active-text="审核通过"
            inactive-text="未审核"
            :active-value="1"
            :inactive-value="0"
            @change="StatusChange()"
        >
        </el-switch>
      </template>
    </el-descriptions-item>
  </el-descriptions>
  <br/>
  <el-button type="primary" size="small"  @click="pre()">返回列表</el-button>
  <el-button type="primary" size="small"  @click="next()">下一步</el-button>
</a-card>
</template>

<script>
import {getLoanInfoById,modifyStatus}
  from "@/services/pad/loan/loanInfo";

export default {
  name: "loan_detail",
  data(){
    return{
      //贷款编号
      id:'',
      loanInfo:{}
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getLoanDetail()
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
        console.log(res)
        this.loanInfo = res.data.data.id
      })
    },
    //审批按键
    StatusChange(){
      modifyStatus(this.id,this.loanInfo.status,null,0).then(res=>{
        this.$message.success(res.data.message)
        this.getLoanDetail()
      })
    },
    //输入审批失败理由
    open() {
      this.$prompt('请输入驳回理由', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '驳回理由不能为空'
      }).then(({value}) => {
        modifyStatus(this.id,-1,value,0).then(res=>{
          this.$message.success(res.data.message)
          this.getLoanDetail()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //下一步
    next(){
        this.$router.push(`/loan/material/${this.id}/${this.loanInfo.cno}`)
    },
    //上一步
    pre(){
      this.$router.push(`/loan/loanInfo`)
    }
  }
}
</script>

<style scoped>

</style>
