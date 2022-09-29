<template>
  <a-card>
    <template>
      <!--步骤条-->
      <el-steps :space="200" :active="2" process-status="wait" align-center>
        <el-step v-if="this.role=='平台管理员'" title="平台审批"></el-step>
        <el-step v-if="this.role=='银行管理员'" title="银行审批"></el-step>
        <el-step title="材料审批"></el-step>
        <el-step v-if="this.role=='平台管理员'" title="审批结果"></el-step>
        <el-step v-if="this.role=='银行管理员'" title="放款"></el-step>
      </el-steps>
      <br/>
      <el-descriptions class="margin-top" title="材料管理"   :column="3"  border>
        <template slot="extra">
          <el-button type="danger" size="small"  @click="open()">驳回</el-button>
        </template>
        <el-descriptions-item label="企业名称" prop="name">
          <template slot="label">
            <i class="el-icon-user"></i>
            企业名称
          </template>
          {{material.name}}
        </el-descriptions-item>
        <el-descriptions-item label="企业市值" prop="value">
          <template slot="label">
            <i class="el-icon-data-line"></i>
            企业市值
          </template>
          {{material.value}}
        </el-descriptions-item>
        <el-descriptions-item label="审核状态" prop="status">
          <template slot="label">
            <i class="el-icon-view"></i>
            审核状态
          </template>
          <el-tag :type="(material.status == '0' ? 'info' : (material.status == '1' ? 'primary' :(material.status == '2' ? 'success' :'danger')))" size="mini">
            {{ material.status == '0' ? '未审核' : (material.status == '1' ? '等待银行审核' :(material.status == '2' ? '审核通过' :'审核失败')) }}
          </el-tag>
<!--          {{material.status}}-->
        </el-descriptions-item>
        <el-descriptions-item label="法人姓名" prop="legalName">
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            法人姓名
          </template>
          {{material.legalName}}
        </el-descriptions-item>
        <el-descriptions-item label="法人电话" prop="legalPhone">
          <template slot="label">
            <i class="el-icon-phone"></i>
            法人电话
          </template>
          {{material.legalPhone}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证号" prop="legalId">
          <template slot="label">
            <i class="el-icon-postcard"></i>
            法人身份证号
          </template>
          {{material.legalId}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证照片" prop="legalImg" :span="3">
          <template slot="label">
            <i class="el-icon-picture"></i>
            法人身份证照片
          </template>
          <template>
            <img
                preview="1"
                :width="200"
                :src="'/pad/img/legal_img/'+material.legalImg"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="企业征信报告" prop="credit" :span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            企业征信报告
          </template>
          <template>
            <img
                preview="1"
                :width="400"
                :src="'/pad/img/credit/'+material.credit"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="抵押物" prop="collateral" :span="3">
          <template slot="label">
            <i class="el-icon-coin"></i>
            抵押物
          </template>
          {{material.collateral}}
        </el-descriptions-item>
        <el-descriptions-item label="抵押物证明" prop="collateralPhoto" :span="3">
          <template slot="label">
            <i class="el-icon-s-check"></i>
            抵押物证明
          </template>
          <template>
            <img
                preview="1"
                :width="400"
                :src="'/pad/img/collateral_photo/'+material.collateralPhoto"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="纳税记录" prop="records" :span="3">
          <template slot="label">
            <i class="el-icon-receiving"></i>
            纳税记录
          </template>
          <template>
            <img
                preview="1"
                :width="400"
                :src="'/pad/img/records/'+material.records"
            />
          </template>
        </el-descriptions-item>

        <el-descriptions-item label="财务报表" prop="turnover" :span="3">
          <template slot="label">
            <i class="el-icon-s-data"></i>
            财务报表
          </template>
          <template>
            <img
                preview="1"
                :width="400"
                :src="'/pad/img/turnover/'+material.turnover"
            />
          </template>

        </el-descriptions-item>

        <el-descriptions-item label="审核操作" prop="status" :span="3"
           v-if="this.role=='平台管理员' && material.status!=1">
         <template slot="label">
            <i class="el-icon-open"></i>
            审核操作
         </template>
          <template>
            <el-switch
                v-model="material.status"
                active-text="审核通过"
                inactive-text="未审核"
                :active-value="1"
                :inactive-value="0"
                @change="StatusChange()"
            > </el-switch>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="审核操作" prop="status" :span="3"
                              v-if="this.role=='银行管理员'">
          <template slot="label">
            <i class="el-icon-open"></i>
            审核操作
          </template>
          <template>
            <el-switch
                v-model="material.status"
                active-text="审核通过"
                inactive-text="未审核"
                :active-value="2"
                :inactive-value="0"
                @change="StatusChange()"
            >
            </el-switch>
          </template>
        </el-descriptions-item>
      </el-descriptions>
      <br/>
      <el-button type="primary" size="small"  @click="pre()">上一步</el-button>
      <el-button type="primary" size="small"  @click="next()">下一步</el-button>
    </template>
  </a-card>
</template>

<script>

import {getMaterialList, changeStatus,changeIsDeleted} from "@/services/pad/company/material";
import {modifyStatus} from "@/services/pad/loan/loanInfo";
export default {
  name: "company_material",
  data() {
    return {
      //贷款编号
      id:'',
      //企业用户编号
      cno:'',
      value1:false,
      material: {},//材料列表
      dialogFormVisible: false,//关闭浮窗
      materialForm: {},//审核数据
      role:'',
      //（1银行,0平台）
      type:''
    }
  },
  created() {
    this.role = this.$store.getters["account/roles"]
    this.id = this.$route.params.id
    this.cno = this.$route.params.cno
    this.getCompanyMaterial()
  },
  methods: {
    getType(){
      if (this.role=='平台管理员'){
        return 0
      }
      if (this.role=='银行管理员'){
        return 1
      }
    },
    //外键查询材料
    getCompanyMaterial() {
      console.log(this.cno)
      getMaterialList(this.cno)
          .then(res => {
            console.log(res)
            this.material = res.data.data.material
          })
    },
    //修改状态
    StatusChange(){
        changeStatus(this.material).then(() => {
          //修改贷款状态
          modifyStatus(this.id,this.material.status,null,this.getType()).then(res=>{
            this.$message.success(res.data.message)
          })
          this.getCompanyMaterial()
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
        //驳回材料
        changeIsDeleted(this.cno,this.id,-1,value,this.getType()).then(() => {
          //驳回申请
          modifyStatus(this.id,-1,value,this.getType()).then(res=>{
            this.$message.success(res.data.message)
          })
          this.getCompanyMaterial()
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
      this.$router.push('/loan/examine/'+this.id)
    },
    //上一步
    pre(){
      this.$router.push('/loan/detail/'+this.id)
    }
  }


}
</script>

<style scoped>

</style>
