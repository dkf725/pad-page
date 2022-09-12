<template>

  <a-card>
    <template>
      <el-descriptions class="margin-top" title="材料管理"  :data="materialList" :column="3" :size="size" border>
        <el-descriptions-item label="企业名称" prop="name">
          <template slot="label">
            <i class="el-icon-user"></i>
            企业名称
          </template>
          Prepaid{{materialList.name}}
        </el-descriptions-item>
        <el-descriptions-item label="企业市值" prop="value">
          <template slot="label">
            <i class="el-icon-data-line"></i>
            企业市值
          </template>
          ??????{{materialList.value}}
        </el-descriptions-item>
        <el-descriptions-item label="审核状态" prop="status">
          <template slot="label">
            <i class="el-icon-view"></i>
            审核状态
          </template>
          ??????{{materialList.status}}
        </el-descriptions-item>
        <el-descriptions-item label="法人姓名" prop="legalName">
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            法人姓名
          </template>
          ???{{materialList.legalName}}
        </el-descriptions-item>
        <el-descriptions-item label="法人电话" prop="legalPhone">
          <template slot="label">
            <i class="el-icon-phone"></i>
            法人电话
          </template>
          Cloud Database{{materialList.legalPhone}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证号" prop="legalId">
          <template slot="label">
            <i class="el-icon-postcard"></i>
            法人身份证号
          </template>
          ???????{{materialList.legaId}}
        </el-descriptions-item>
        <el-descriptions-item label="法人身份证照片" prop="legalImg" :span="3">
          <template slot="label">
            <i class="el-icon-picture"></i>
            法人身份证照片
          </template>
          <template>
            <img
                preview="1"
                :width="100"
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="抵押物" prop="collateral" :span="3">
          <template slot="label">
            <i class="el-icon-coin"></i>
            抵押物
          </template>
          ??????{{materialList.collateral}}
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
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
          </template>

        </el-descriptions-item>

        <el-descriptions-item label="审核操作" prop="status">
          <template slot="label">
            <i class="el-icon-open"></i>
            审核操作
          </template>
          <el-switch
              v-model="materialList.status"
              active-text="审核未通过"
              inactive-text="审核通过"
              :active-value="1"
              :inactive-value="0"
          >
          </el-switch>
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
      value1:false,
      materialList: [],//材料列表
      dialogFormVisible: false,//关闭浮窗
      materialForm: {},//审核数据

    }
  },
  created() {
  },
  methods: {

    //外键查询材料
    getCompanyMaterial() {
      getMaterialList(this.cNo)
          .then(res => {
            console.log(res)
            this.materialList = res.data.data
          })

    },
    //审批按键
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
    },
    //修改状态
    handleStatus(){

    },

  }


}
</script>

<style scoped>

</style>