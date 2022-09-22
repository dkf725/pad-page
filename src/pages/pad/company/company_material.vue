<template>

  <a-card>
    <template>
      <el-descriptions class="margin-top" title="材料管理"   :column="3"  border>
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
            <el-tag
                :type="material.status===2?'danger':'success'"
            >
              <span v-if="material.status===2">审核未通过</span>
              <span v-if="material.status===1">审核通过</span>
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

        <el-descriptions-item label="审核操作" prop="status">
         <template slot="label">
            <i class="el-icon-open"></i>
            审核操作
         </template>
          <template>
          <el-switch
              v-model="material.status"
              active-text="审核通过"
              inactive-text="审核未通过"
              :active-value="1"
              :inactive-value="0"
              @change="StatusChange()"
          >
          </el-switch>
            <br>
            <el-switch
                v-model="material.isDeleted"
                active-text="驳回"
                inactive-text="未驳回"
                :active-value="0"
                :inactive-value="1"
                @change="StatusChange()"
            >
            </el-switch>
          </template>
        </el-descriptions-item>
        <!--        <template slot-scope="scope">
                  <div>
                    <a-button type="primary" @click="showModal(scope.row)" style="margin-left:200%;margin-top:20px;">审批
                    </a-button>
                    <a-modal title="审核信息" :visible.sync="dialogFormVisible" :closable="false">
                      <a-form class="demo-form-inline" :inline="true" :model="materialForm">
                        <a-form-item label="审核状态">
                          <a-select v-model="materialForm.status">
                            <a-select-option label="待审核" value="1">待审核</a-select-option>
                            <a-select-option label="审核未通过" value="2">审核未通过</a-select-option>
                            <a-select-option label="审核通过" value="3">审核通过</a-select-option>
                            <a-select-option label="审核失败" value="4">审核失败</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-form>
                      <div slot="footer" class="dialog-footer">
                        <a-button @click="dialogFormVisible = false">取 消</a-button>
                        <a-button type="primary" @click="handleEdit" style="margin-left:10px;">确 定</a-button>
                      </div>
                    </a-modal>
                  </div>
                </template>-->
      </el-descriptions>
    </template>


  </a-card>
</template>

<script>

import {getMaterialList, changeStatus} from "@/services/pad/company/material";
export default {


  name: "company_material",
  data() {

    return {
      id:'',
      value1:false,
      material: {},//材料列表
      dialogFormVisible: false,//关闭浮窗
      materialForm: {},//审核数据

    }
  },
  created() {
    this.id = this.$route.params.id
    this. getCompanyMaterial()
  },
  methods: {

    //外键查询材料
    getCompanyMaterial() {
      getMaterialList(this.id)
          .then(res => {
            console.log(res)
            this.material = res.data.data.material
          })

    },
    /*//审批按键
    showModal(row) {
      this.dialogFormVisible = true
      this.recordForm = row
    },

    //审查确认按键
    handleEdit() {
      changeStatus(this.materialForm)
          .then(res => {
            console.log(res)
            this.$message.success(res.data.message)
          })

      this.dialogFormVisible = false
    },*/
    //修改状态
    StatusChange(){
        changeStatus(this.material).then(res => {
          this.$message.success(res.data.message)
          this. getCompanyMaterial()
        })
    },

  }


}
</script>

<style scoped>

</style>
