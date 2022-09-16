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
      <el-form-item label="手机号码" prop="phone">
        <el-input
            v-model="queryParams.phone"
            placeholder="请输入手机号码"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
            v-model="queryParams.email"
            placeholder="请输入邮箱"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="认证状态" prop="authStatus">
        <el-select
            v-model="queryParams.authStatus"
            placeholder="认证状态"
            clearable
            style="width: 240px"
        >
          <el-option
              :key="2"
              label="认证通过"
              :value="2"
          />
          <el-option
              :key="0"
              label="认证失败"
              :value="-1"
          />
        </el-select>
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

    <el-table :data="companyInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业编号" prop="cno" width="120" align="center"/>
      <el-table-column label="企业名称" prop="name" width="120" align="center"/>
      <el-table-column label="企业邮箱" prop="email" width="120" align="center"/>
      <el-table-column label="企业电话" prop="phone" width="120" align="center"/>
      <el-table-column label="认证状态" prop="authStatus" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="(scope.row.authStatus == '0' ? 'info' : (scope.row.authStatus == '2' ? 'success' :'danger'))" size="mini">
            {{ scope.row.authStatus == '0' ? '未审核' : (scope.row.authStatus == '2' ? '审核通过' :'审核失败') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
          >查看详情</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="material(scope.row)"
          >材料审核</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`company:info:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`company:info:remove`"
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

    <!-- 添加或修改企业用户基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="企业编号" prop="cno" v-if="title=='添加企业用户基本信息'">
          <el-input v-model="form.cno" placeholder="请输入企业编号" />
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入企业邮箱" />
        </el-form-item>
        <el-form-item label="企业电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入企业电话" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password/>
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
import {getCompanyInfoById, getCompanyInfoList,editCompanyInfo,removeCompanyInfo,addCompanyInfo}
  from "@/services/pad/company/companyInfo";

export default {
  name: "companyInfo",
  data(){
    return{
      page:1,//当前页
      limit:5,//每页记录数
      total:0,//总记录数
      companyInfoList:[],  //企业用户基本信息列表
      queryParams:{},//条件查询对象
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        isDeleted:1
      },//添加修改表单
      rules: {//表单校验
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
          { min: 4, max: 10, message: '企业名称长度必须介于 4 和 10 之间', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    //初始化企业用户基本信息
    this.getList(this.page,this.limit)
  },
  methods:{
    //转跳到详情页
    detail(row){
     /* this.$router.push({name:'/company/detail',query: {id:row.id}})*/
      this.$router.push('/company/detail/'+row.cno)
    },//转跳到详情页
    material(row){
      this.$router.push('/company/material/'+row.cno)
    },

    //每页条数改变时
    handleSizeChange(size){
      this.getList(this.page,size)
    },
    //当前页数改变时
    handleCurrentChange(page){
      this.getList(page,this.limit)
    },
    //查询所有企业用户基本信息
    getList(page,limit){
      getCompanyInfoList(page,limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.companyInfoList = res.data.data.companyInfoList
            this.total = res.data.data.total
          })
    },
    //搜索按钮
    handleQuery(){
      this.getList(this.page,this.limit);
    },
    //重置按钮
    resetQuery(){
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //多选按钮
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.cno);
      this.multiple = !selection.length;
    },
    //新增按钮
    handleAdd(){
      console.log(this.form.cno)
      //修改title
      this.title = '添加企业用户基本信息'
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
      getCompanyInfoById(row.cno).then(res=>{
        console.log(res)
        this.form = res.data.data.id
      })
      //修改title
      this.title = '修改企业用户基本信息'
      //打开对话框
      this.open = true
    },
    //提交表单
    submitForm(){
      console.log(this.form)
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.title == "修改企业用户基本信息"){
            //有用户id 修改操作
            editCompanyInfo(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList(this.page,this.limit)
            })
          }else {
            //无用户id 添加操作
            addCompanyInfo(this.form).then(res=>{
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
    //删除按钮
    handleDelete(row){
      console.log(this.multiple)
      const cno = row.cno || this.ids;
      this.$confirm('确定要删除编号为'+cno+'的企业用户基本信息吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
        removeCompanyInfo(cno).then(res=>{
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
    },
  }
}
</script>

<style scoped>

</style>
