<template>
 <a-card>
    <!--搜索框-->
   <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
     <el-form-item label="用户名称" prop="name">
       <el-input
           v-model="queryParams.name"
           placeholder="请输入用户名称"
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
     <el-form-item label="状态" prop="status">
       <el-select
           v-model="queryParams.status"
           placeholder="用户状态"
           clearable
           style="width: 240px"
       >
         <el-option
             :key="1"
             label="正常"
             :value="1"
         />
         <el-option
             :key="0"
             label="禁用"
             :value="0"
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
           v-auth:permission="`system:user:add`"
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
       >删除</el-button>
     </el-col>
     <el-col :span="1.5">
       <el-button
           type="warning"
           plain
           icon="el-icon-download"
           size="mini"
           :disabled="multiple"
           @click="handleExport"
       >导出</el-button>
     </el-col>
   </el-row>
   <!--用户数据-->
   <el-table :data="userList" @selection-change="handleSelectionChange">
     <el-table-column type="selection" width="50" align="center" />
     <el-table-column label="用户编号" align="center" key="id" prop="id" width="200"/>
     <el-table-column label="用户名称" align="center" key="name" prop="name"/>
     <el-table-column label="用户邮箱" align="center" key="email" prop="email"/>
     <el-table-column label="手机号码" align="center" key="phone" prop="phone"  width="180"/>
     <el-table-column label="状态" align="center" key="status">
       <template slot-scope="scope">
         <el-switch
             v-model="scope.row.status"
             active-color="#13ce66"
             inactive-color="#ff4949"
             :active-value="1"
             :inactive-value="0"
             v-auth:permission="`system:user:edit`"
             @change="handleStatusChange(scope.row)"
         ></el-switch>
       </template>
     </el-table-column>
     <el-table-column
         label="操作"
         align="center"
         width="180"
         class-name="small-padding fixed-width"
     >
       <template slot-scope="scope" v-if="scope.row.id != 1">
         <el-button
             size="mini"
             type="text"
             icon="el-icon-edit"
             @click="handleUpdate(scope.row)"
             v-auth:permission="`system:user:edit`"
         >修改</el-button>
         <el-button
             size="mini"
             type="text"
             icon="el-icon-delete"
             @click="handleDelete(scope.row)"
             v-auth:permission="`system:user:remove`"
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

   <!-- 添加或修改用户配置对话框 -->
   <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
     <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       <el-row>
         <el-col :span="18">
           <el-form-item label="用户昵称" prop="name">
             <el-input v-model="form.name" placeholder="请输入用户名" maxlength="30" />
           </el-form-item>
         </el-col>
       </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item v-if="form.id == undefined" label="用户密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
         <el-col :span="18">
           <el-form-item label="手机号码" prop="phone">
             <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="18">
           <el-form-item label="邮箱" prop="email">
             <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="18">
           <el-form-item label="状态">
             <el-radio-group v-model="form.status">
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
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="18">
           <el-form-item label="角色">
             <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
               <el-option
                   v-for="item in roleOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"
               ></el-option>
             </el-select>
           </el-form-item>
         </el-col>
       </el-row>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitForm">确 定</el-button>
       <el-button @click="cancel">取 消</el-button>
     </div>
   </el-dialog>

 </a-card>
</template>

<script>

import {getUserList,addUser,changeStatus,editUser,getUser,delUser,exportUser}
  from '@/services/pad/system/user';
import {getRoleOptions} from "@/services/pad/system/role";

export default {
  name: 'index',
  data(){
    return{
      page:1,//当前页
      limit:5,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      userList:[],//用户列表
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        status:1,
        roleIds:[]
      },//添加修改表单
      roleOptions:[],//角色选项
      rules: {//表单校验
        name: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
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
    //初始化用户列表
    this.getList(this.page,this.limit)
    //初始化角色选框
    this.getRoleSelect()
  },
  methods:{
    //查询所有用户
    getList(page,limit){
      getUserList(page,limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.userList = res.data.data.adminList
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
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    //新增按钮
    handleAdd(){
      //修改title
      this.title = '添加用户'
      //清空表单
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      //打开对话框
      this.open = true
    },
    //修改状态
    handleStatusChange(row){
      this.$confirm('确定要停用'+row.name+'用户吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            changeStatus(row).then(res=>{
              this.$message.success(res.data.message)
            })
          })
    },
    //修改按钮
    handleUpdate(row){
      //从数据库中查询用户
      getUser(row.id).then(res=>{
        this.form = res.data.data.admin
      })
      //修改title
      this.title = '修改用户'
      //打开对话框
      this.open = true
    },
    //删除按钮
    handleDelete(row){
      console.log(this.multiple)
      const userIds = row.id || this.ids;
      this.$confirm('确定要删除编号为'+userIds+'用户吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
            delUser(userIds).then(res=>{
              console.log(res)
              if (res.data.code >= 0){
                this.$message.success(res.data.message)
                //刷新页面
                this.getList(this.page,this.limit)
              }else {
                this.$message.error(res.data.message)
              }
            })
          })
    },
    //导出Excel
    handleExport(){
      this.$confirm('是否确认导出所选用户数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=> {
        exportUser(this.ids).then(res=>{
          const url = window.URL.createObjectURL(new Blob([res.data],{type: "application/vnd.ms-excel"}))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', "用户数据.xlsx")// 文件名
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        })
      })
    },
    //获取角色选框
    getRoleSelect(){
      getRoleOptions().then(res=>{
        this.roleOptions = res.data.data.roleOptions
      })
    },
    //提交表单
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.id != undefined){
            //有用户id 修改操作
            editUser(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList(this.page,this.limit)
            })
          }else {
            //无用户id 添加操作
            addUser(this.form).then(res=>{
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
