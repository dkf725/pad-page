<template>
 <a-card>
    <!--搜索框-->
   <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
     <el-form-item label="用户名称" prop="userName">
       <el-input
           v-model="queryParams.name"
           placeholder="请输入用户名称"
           clearable
           style="width: 240px"
           @keyup.enter.native="handleQuery"
       /><!--输入框回车时查询-->
     </el-form-item>
     <el-form-item label="手机号码" prop="phonenumber">
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
           v-model="queryParams.isDeleted"
           placeholder="用户状态"
           clearable
           style="width: 240px"
       >
         <!--从字典中查询-->
         <!--<el-option
             v-for="dict in dict.type.sys_normal_disable"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
         />-->
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
           v-auth="['system:user:add']"
       >新增</el-button>
     </el-col>
     <el-col :span="1.5">
       <el-button
           type="success"
           plain
           icon="el-icon-edit"
           size="mini"
           :disabled="single"
           @click="handleUpdate"
           v-auth="['system:user:edit']"
       >修改</el-button>
     </el-col>
     <el-col :span="1.5">
       <el-button
           type="danger"
           plain
           icon="el-icon-delete"
           size="mini"
           :disabled="multiple"
           @click="handleDelete"
           v-auth="['system:user:remove']"
       >删除</el-button>
     </el-col>
     <el-col :span="1.5">
       <el-button
           type="info"
           plain
           icon="el-icon-upload2"
           size="mini"
           @click="handleImport"
           v-auth="['system:user:import']"
       >导入</el-button>
     </el-col>
     <el-col :span="1.5">
       <el-button
           type="warning"
           plain
           icon="el-icon-download"
           size="mini"
           @click="handleExport"
           v-auth="['system:user:export']"
       >导出</el-button>
     </el-col>
   </el-row>
   <!--用户数据-->
   <el-table :data="userList" @selection-change="handleSelectionChange">
     <el-table-column type="selection" width="50" align="center" />
     <el-table-column label="用户编号" align="center" key="id" prop="id"/>
     <el-table-column label="用户名称" align="center" key="name" prop="name"/>
     <el-table-column label="用户邮箱" align="center" key="email" prop="email"/>
     <el-table-column label="手机号码" align="center" key="phone" prop="phone"  width="120"/>
     <el-table-column label="状态" align="center" key="isDeleted">
       <template slot-scope="scope">
         <el-switch
             v-model="scope.row.isDeleted"
             :active-value="1"
             :inactive-value="0"
             @change="handleStatusChange(scope.row)"
         ></el-switch>
       </template>
     </el-table-column>
     <el-table-column
         label="操作"
         align="center"
         width="160"
         class-name="small-padding fixed-width"
     >
       <template slot-scope="scope" v-if="scope.row.id !== 1">
         <el-button
             size="mini"
             type="text"
             icon="el-icon-edit"
             @click="handleUpdate(scope.row)"
             v-auth="['system:user:edit']"
         >修改</el-button>
         <el-button
             size="mini"
             type="text"
             icon="el-icon-delete"
             @click="handleDelete(scope.row)"
             v-auth="['system:user:remove']"
         >删除</el-button>
         <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
                      v-auth="['system:user:resetPwd', 'system:user:edit']" >
           <!-- v-auth 指定权限 -->
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                               v-auth="['system:user:resetPwd']">重置密码</el-dropdown-item>
             <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"
                               v-auth="['system:user:edit']">分配角色</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown>
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

   <!-- 添加或修改用户配置对话框 -->
  <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
     <el-form ref="form" :model="form" :rules="rules" label-width="80px">
       <el-row>
         <el-col :span="12">
           <el-form-item label="用户昵称" prop="nickName">
             <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="归属部门" prop="deptId">
             <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" />
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="12">
           <el-form-item label="手机号码" prop="phonenumber">
             <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="邮箱" prop="email">
             <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="12">
           <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
             <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
             <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="12">
           <el-form-item label="用户性别">
             <el-select v-model="form.sex" placeholder="请选择性别">
               &lt;!&ndash;<el-option
                   v-for="dict in dict.type.sys_user_sex"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
               ></el-option>&ndash;&gt;
             </el-select>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="状态">
             <el-radio-group v-model="form.status">
               &lt;!&ndash;<el-radio
                   v-for="dict in dict.type.sys_normal_disable"
                   :key="dict.value"
                   :label="dict.value"
               >{{dict.label}}</el-radio>&ndash;&gt;
             </el-radio-group>
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="12">
           <el-form-item label="岗位">
             <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
               <el-option
                   v-for="item in postOptions"
                   :key="item.postId"
                   :label="item.postName"
                   :value="item.postId"
                   :disabled="item.status == 1"
               ></el-option>
             </el-select>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="角色">
             <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
               <el-option
                   v-for="item in roleOptions"
                   :key="item.roleId"
                   :label="item.roleName"
                   :value="item.roleId"
                   :disabled="item.status == 1"
               ></el-option>
             </el-select>
           </el-form-item>
         </el-col>
       </el-row>
       <el-row>
         <el-col :span="24">
           <el-form-item label="备注">
             <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
           </el-form-item>
         </el-col>
       </el-row>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitForm">确 定</el-button>
       <el-button @click="cancel">取 消</el-button>
     </div>
   </el-dialog>-->

 </a-card>
</template>

<script>

import {getUserList} from '@/services/pad/system/user'

export default {
  name: 'index',
  data(){
    return{
      page:1,//当前页
      limit:10,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      userList:[],//用户列表
      single: true,// 非单个禁用
      multiple: true,// 非多个禁用
    }
  },
  created() {
    this.getList()
  },
  methods:{
    //查询所有用户
    getList(page=1){
      this.page = page
      getUserList(this.page,this.limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.userList = res.data.data.adminList
            this.total = res.data.data.total
          })
    },
    //搜索按钮
    handleQuery(){
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //重置按钮
    resetQuery(){
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    //多选按钮
    handleSelectionChange(){

    },
    //新增
    handleAdd(){

    },
    //修改状态
    handleStatusChange(){

    },
    //修改按钮
    handleUpdate(){

    },
    //删除按钮
    handleDelete(){

    },
    //更多操作
    handleCommand(){

    },
    //导入Excel
    handleImport(){

    },
    //导出Excel
    handleExport(){

    }
  }
}
</script>

<style scoped>

</style>
