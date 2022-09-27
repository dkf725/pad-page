
<template>
  <a-card>
    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="银行名称" prop="bankName">
        <el-input
            v-model="queryParams.bankName"
            placeholder="请输入银行名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--操作-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-auth:permission="`system:bank:add`"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-auth:permission="`system:bank:remove`"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-auth:permission="`system:bank:export`"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table :data="bankList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="银行编号" prop="bankNo" width="100" />
      <el-table-column label="银行名称" prop="bankName" width="120" />
      <el-table-column label="年化利率" prop="borrowYearRate" width="120" />
      <el-table-column label="逾期利率" prop="overdueRate" width="120" />
      <el-table-column label="产品说明" prop="description" width="120" show-overflow-tooltip/>
      <el-table-column label="银行电话" prop="phone" width="120" />
      <el-table-column label="省" prop="province" width="120">
        <template slot-scope="scope">
          <span>{{convertAddress(scope.row.province)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" width="120" >
        <template slot-scope="scope">
          <span>{{convertAddress(scope.row.city)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区" prop="area" width="120" >
        <template slot-scope="scope">
          <span>{{convertAddress(scope.row.area)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="银行详细地址" prop="address" width="120" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id != 1">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`system:bank:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`system:bank:edit`"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
        style="padding:30px 0;text-align:center;"
        :total="total"
        :current-page="page"
        :page-size="limit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入银行名称" />
        </el-form-item>
        <el-form-item label="年化利率" prop="borrowYearRate">
          <el-input v-model="form.borrowYearRate" placeholder="请输入年化利率" />
        </el-form-item>
        <el-form-item label="逾期利率" prop="overdueRate">
          <el-input v-model="form.overdueRate" placeholder="请输入逾期利率" />
        </el-form-item>
        <el-form-item label="产品说明" prop="description">
          <el-input v-model="form.description" placeholder="请输入产品说明" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="省市区">
        <div id="app" >
          <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
          </el-cascader>
        </div>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.isDeleted">
            <el-radio
                :key="1"
                :label="1"
            >正常</el-radio>
            <el-radio
                :key="0"
                :label="0"
            >禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </a-card>
</template>

<script>
import Vue from 'vue'
import {getBankList,getBankById,removeBank,editBank,addBank}
  from "@/services/pad/bank/bank";
import { regionData,CodeToText} from 'element-china-area-data'
export default {
  name: "index",
  data(){
    return{
      page:1,//当前页
      limit:3,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      bankList:[],//银行列表
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      options: regionData,
      selectedOptions: [],
      form: {
        isDeleted:1
      },//添加修改表单
      rules: {//表单校验
        bankName: [
          { required: true, message: "银行名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '银行名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //初始化角色列表
    this.getList(this.page,this.limit)
  },
  methods:{
    //区域码转换为汉字
    convertAddress(value){
      return CodeToText[value]
    },
    //地址联动
    handleChange (value) {
      //将地址的值存入数据库
      let province = value[0]
      let city = value[1]
      let area = value[2]
      Vue.set(this.form,"province",province)
      Vue.set(this.form,"city",city)
      Vue.set(this.form,"area",area)
    },
    //查询所有角色
    getList(page,limit){
      getBankList(page,limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.bankList = res.data.data.bankList
            this.total = res.data.data.total
          })
    },
    //搜索按钮
    handleQuery(){
      this.getList(this.page,this.limit)
    },
    //重置按钮
    resetQuery(){
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //多选按钮
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.bankNo);
      this.multiple = !selection.length;
    },
    //新增按钮
    handleAdd(){
      //修改title
      this.title = '添加银行'
      //清空表单
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      //打开对话框
      this.open = true
    },

    //修改按钮
    handleUpdate(row){
      //从数据库中查询银行
      getBankById(row.bankNo).then(res=>{
        this.form = res.data.data.bank
        let province = this.form.province
        let city = this.form.city
        let area = this.form.area
        this.selectedOptions=[province,city,area]
      })
      this.title = '修改银行信息'
      //打开对话框
      this.open = true
    },
    //删除按钮
    handleDelete(row){
      const bankNo = row.bankNo || this.ids;
      this.$confirm('确定要删除编号为'+bankNo+'角色吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
        removeBank(bankNo).then(res=>{
          console.log(res)
          if (res.data.code >= 0){
            this.$message.success(res.data.message)
            //刷新页面
            this.getList(this.page,this.limit
            )
          }else {
            this.$message.error(res.data.message)
          }
        })
      })
    },
    //导出Excel
    handleExport(){

    },
    //提交表单
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.bankNo != undefined){
            //有用户id 修改操作
            editBank(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList(this.page,this.limit)
            })
          }else {
            //无用户id 添加操作
            addBank(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList(this.page,this.limit)
            })
          }
        }
      })
    },
    //取消
    cancel(){
      this.open = false
    },
    //每页条数改变时
    handleSizeChange(size){
      this.getList(this.page,size)
    },
    //当前页数改变时
    handleCurrentChange(page){
      this.getList(page,this.limit)
    }
  }
}
</script>

<style scoped>

</style>
