<template>
  <a-card>
    <template>
      <el-descriptions title="信息管理"  :data="detailList" :column="3" border>

        <el-descriptions-item label="企业名称" prop="name">
          <template slot="label">
            <i class="el-icon-user"></i>
            企业名称
          </template>
         {{name}}
        </el-descriptions-item>
        <el-descriptions-item label="企业类型" prop="type">
          <template slot="label">
            <i class="el-icon-guide"></i>
            企业类型
          </template>
          {{detailList.type}}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间" prop="createTime">
          <template slot="label">
            <i class="el-icon-alarm-clock"></i>
            注册时间
          </template>
          {{detailList.createTime}}
        </el-descriptions-item>
        <el-descriptions-item label="法人姓名" prop="legalName">
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            法人姓名
          </template>
          {{legalName}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证号" prop="legalId">
          <template slot="label">
            <i class="el-icon-postcard"></i>
            法人身份证号
          </template>
          {{detailList.legalId}}
        </el-descriptions-item>
        <el-descriptions-item label="企业信誉度" prop="credit">
          <template slot="label">
            <i class="el-icon-circle-check"></i>
            企业信誉度
          </template>
          {{detailList.credit}}
        </el-descriptions-item>
        <el-descriptions-item label="企业经营范围" prop="scope">
          <template slot="label">
            <i class="el-icon-s-operation"></i>
            企业经营范围
          </template>
          {{detailList.scope}}
        </el-descriptions-item>
        <el-descriptions-item label="公司详细地址" prop="address">
          <template slot="label">
            <i class="el-icon-office-building"></i>
            公司详细地址
          </template>
          {{detailList.address}}
        </el-descriptions-item>
        <el-descriptions-item label="营业执照到期时间" prop="licTime">
          <template slot="label">
            <i class="el-icon-time"></i>
            营业执照到期时间
          </template>
          {{detailList.licTime}}
        </el-descriptions-item>

        <el-descriptions-item label="营业执照" prop="license">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            营业执照
          </template>
          <template>
            <img
                preview="2"
                :width="400"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </template>




  </a-card>
</template>

<script>
import {getDetailList} from "@/services/pad/company/detail";

export default {
  name: "company_detail",
  data(){
    return{
      detailList:[],//详情列表
    }
  },
  created() {
    this.getCompanyDetailList()
  },
  methods:{
    //外键查询到信息
    getCompanyDetailList(){
      this.cNo=this.$route.query.cNo;//获取id
      getDetailList(1)
          .then(res=>{
            console.log(res)
            this.detailList = res.data.data.detail
          })
    }
  }
}
</script>

<style scoped>

</style>