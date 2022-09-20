<template>
    <a-card>
      <el-descriptions title="信息管理" :column="3" border>
        <el-descriptions-item label="企业名称" prop="name">
          <template slot="label">
            <i class="el-icon-user"></i>
            企业名称
          </template>
         {{detail.name}}
        </el-descriptions-item>
        <el-descriptions-item label="企业类型" prop="type">
          <template slot="label">
            <i class="el-icon-guide"></i>
            企业类型
          </template>
          <span v-if="detail.type===0">个人独资</span>
          <span v-if="detail.type===1">合伙企业</span>
          <span v-if="detail.type===2">有限责任公司</span>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" prop="createTime">
          <template slot="label">
            <i class="el-icon-alarm-clock"></i>
            注册时间
          </template>
          {{detail.createTime}}
        </el-descriptions-item>
        <el-descriptions-item label="法人姓名" prop="legalName">
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            法人姓名
          </template>
          {{detail.legalName}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证号" prop="legalId">
          <template slot="label">
            <i class="el-icon-postcard"></i>
            法人身份证号
          </template>
          {{detail.legalId}}
        </el-descriptions-item>
        <el-descriptions-item label="企业信誉度" prop="credit">
          <template slot="label">
            <i class="el-icon-circle-check"></i>
            企业信誉度
          </template>
          {{detail.credit}}
        </el-descriptions-item>
        <el-descriptions-item label="企业经营范围" prop="scope">
          <template slot="label">
            <i class="el-icon-s-operation"></i>
            企业经营范围
          </template>
          {{detail.scope}}
        </el-descriptions-item>
        <el-descriptions-item label="公司详细地址" prop="address">
          <template slot="label">
            <i class="el-icon-office-building"></i>
            公司详细地址
          </template>
          {{detail.address}}
        </el-descriptions-item>
        <el-descriptions-item label="营业执照到期时间" prop="licTime">
          <template slot="label">
            <i class="el-icon-time"></i>
            营业执照到期时间
          </template>
          {{detail.licTime}}
        </el-descriptions-item>

        <el-descriptions-item label="营业执照" prop="license" :span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            营业执照
          </template>
          <template >
            <img
                preview="2"
                :width="400"
                :src="'/pad/img/license/'+detail.license"
            />
          </template>
        </el-descriptions-item>

        <el-descriptions-item label="审核操作" prop="status">
          <template slot="label">
            <i class="el-icon-open"></i>
            审核操作
          </template>
          <template>
            <el-switch
                active-text="审核通过"
                inactive-text="审核未通过"
                :active-value="1"
                :inactive-value="0"
            >
            </el-switch> </template>
        </el-descriptions-item>
      </el-descriptions>
    </a-card>
</template>

<script>
import {getDetailList} from "@/services/pad/company/detail";

export default {
  name: "company_detail",
  data(){
    return{
      id:'',
      detail: {},//详情列表
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getCompanyDetailList()
  },
  methods:{
    //外键查询到信息
    getCompanyDetailList(){
      getDetailList(this.id)
          .then(res=>{
            console.log(res)
            this.detail = res.data.data.detail
          })
    }
  }
}
</script>

<style scoped>

</style>
