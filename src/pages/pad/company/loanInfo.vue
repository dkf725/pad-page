<template>
  <a-card>
    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
      <el-form-item label="企业名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入企业名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        /><!--输入框回车时查询-->
      </el-form-item>
      <el-form-item label="银行名称" prop="bankName">
        <el-input
            v-model="queryParams.bankName"
            placeholder="请输入银行名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="贷款用途" prop="purpose">
        <el-input
            v-model="queryParams.purpose"
            placeholder="请输入贷款用途"
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
            v-auth:permission="`company:info:add`"
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
        >批量删除</el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                  type="warning"
                  plain
                  icon="el-icon-download"
                  size="mini"
                  :disabled="multiple"
                  @click="handleExport"
              >导出</el-button>
            </el-col>-->
    </el-row>


    <el-table :data="loanInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="贷款编号" prop="id" width="100" />
      <el-table-column label="企业名称" prop="name" width="120" />
      <el-table-column label="银行名称" prop="bankName" width="120" />
      <el-table-column label="收款账户" prop="bankNumber" width="120" />
      <el-table-column label="开户行" prop="bankType" width="120" />
      <el-table-column label="贷款金额" prop="amount" width="120" />
      <el-table-column label="贷款用途" prop="purpose" width="120" />
      <el-table-column label="借款期限" prop="period" width="120" />
      <el-table-column label="认证状态" prop="status" width="120" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`company:loanInfo:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`company:loanInfo:remove`"
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
        @pagination="getList"
    />

    <!-- 添加或修改贷款信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="贷款信息编号" prop="id" v-if="title=='添加贷款信息'">
          <el-input v-model="form.id" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业编号" prop="cno" v-if="title=='添加贷款信息'">
          <el-input v-model="form.cno" placeholder="请输入企业编号" />
        </el-form-item>
        <el-form-item label="银行编号" prop="bankNo" v-if="title=='添加贷款信息'">
          <el-input v-model="form.bankNo" placeholder="请输入银行编号" />
        </el-form-item>
        <el-form-item label="收款账户" prop="bankNumber">
          <el-input v-model="form.bankNumber" placeholder="请输入收款账户" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankType">
          <el-input v-model="form.bankType" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="贷款金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入贷款金额" />
        </el-form-item>
        <el-form-item label="贷款用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入贷款用途" />
        </el-form-item>
        <el-form-item label="借款期限" prop="period">
          <el-input v-model="form.period" placeholder="请选择借款期限" />
        </el-form-item>
        <el-form-item label="还款方式" prop="returnMethod">
          <el-input v-model="form.returnMethod" placeholder="请选择还款方式" />
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
import {getLoanInfoList,removeLoanInfo,getLoanInfoById,editLoanInfo,addLoanInfo}
  from "@/services/pad/company/loanInfo";

export default {
  name: "loanInfo",
  data(){
    return{
      page:1,//当前页
      limit:3,//每页记录数
      total:0,//总记录数
      loanInfoList:[],  //企业用户基本信息列表
      queryParams:{},//条件查询对象
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        isDeleted:1
      },//添加修改表单
      rules: {//表单校验
        id: [
          { required: true, message: "贷款信息编号不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '企业名称长度必须介于 4 和 10 之间', trigger: 'blur' }
        ],
        cno: [
          { required: true, message: "企业编号不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '企业编号长度必须介于 4 和 10 之间', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: "银行编号不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '银行编号长度必须介于 4 和 10 之间', trigger: 'blur' }
        ],
        bankNumber: [
          {
            required: true,
            pattern: /[0-9]{19}/,
            message: "请输入正确的银行卡号",
            trigger: "blur"
          }
        ],
        bankType: [
          { required: true, message: "开户行不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "贷款金额不能为空", trigger: "blur" }
        ],
        purpose: [
          { required: true, message: "贷款用途不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "借款期限不能为空", trigger: "blur" }
        ],
        returnMethod: [
          { required: true, message: "还款方式不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    //初始化贷款信息
    this.getList()
  },
  methods:{
    //查询所有企业用户基本信息
    getList(page=1){
      this.page = page
      getLoanInfoList(this.page,this.limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.loanInfoList = res.data.data.loanInfoList
            this.total = res.data.data.total
          })
    },
    //搜索按钮
    handleQuery(){
      this.getList();
    },
    //重置按钮
    resetQuery(){
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //多选按钮
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    //新增按钮
    handleAdd(){
      console.log(this.form.id)
      //修改title
      this.title = '添加贷款信息'
      //清空表单
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      this.form = {
        isDeleted:1,
      }
      //打开对话框
      this.open = true
      //console.log("999999999999999999[[["+this.form.cno)
    },
    //修改按钮
    handleUpdate(row){
      //从数据库中查询企业用户基本信息
      getLoanInfoById(row.cno).then(res=>{
        console.log(res)
        this.form = res.data.data.id
      })
      //修改title
      this.title = '修改贷款信息'
      //打开对话框
      this.open = true
    },
    //提交表单
    submitForm(){
      console.log(this.form)
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.title == "修改贷款信息"){
            //有用户id 修改操作
            editLoanInfo(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList()
            })
          }else {
            //无用户id 添加操作
            addLoanInfo(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList()
            })
          }
        }
      })
    },
    //取消
    cancel(){
      this.open = false
    },
    //删除按钮
    handleDelete(row){
      console.log(this.multiple)
      const id = row.id || this.ids;
      this.$confirm('确定要删除编号为'+id+'的企业用户基本信息吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
        removeLoanInfo(id).then(res=>{
          console.log(res)
          if (res.data.code >= 0){
            this.$message.success(res.data.message)
            //刷新页面
            this.getList()
          }else {
            this.$message.error(res.data.message)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
