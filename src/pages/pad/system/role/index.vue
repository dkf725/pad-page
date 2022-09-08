<template>
  <a-card>
    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="角色名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入角色名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色值" prop="value">
        <el-input
            v-model="queryParams.value"
            placeholder="请输入角色值"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
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
            v-auth:permission="`system:role:add`"
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
            v-auth:permission="`system:role:remove`"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-auth:permission="`system:role:export`"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="id" width="130" />
      <el-table-column label="角色名称" prop="name" width="170" />
      <el-table-column label="角色值" prop="value" width="170" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
              v-auth:permission="`system:role:edit`"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id != 1">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`system:role:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`system:role:remove`"
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="value">
          <span slot="label">
            <el-tooltip content="角色值，如：'admin'" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            角色值
          </span>
          <el-input v-model="form.value" placeholder="请输入角色值" />
        </el-form-item>
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
       <!-- <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menu"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
          ></el-tree>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </a-card>
</template>

<script>
import {getRoleList,changeStatus,getRole,delRole}
  from "@/services/pad/system/role";
import {addUser, editUser} from "@/services/pad/system/user";
export default {
  name: "index",
  data(){
    return{
      page:1,//当前页
      limit:10,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      roleList:[],//角色列表
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        status:1
      },//添加修改表单
      rules: {//表单校验
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '角色名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        value: [
          { required: true, message: "角色值不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '角色值长度必须介于 2 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //初始化角色列表
    this.getList()
  },
  methods:{
    //查询所有角色
    getList(page=1){
      this.page = page
      getRoleList(this.page,this.limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.roleList = res.data.data.roleList
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
      console.log(this.ids)
      console.log(this.multiple)
    },
    //新增按钮
    handleAdd(){
      //修改title
      this.title = '添加角色'
      //清空表单
      this.$refs["form"].resetFields();
      //打开对话框
      this.open = true
    },
    //修改状态
    handleStatusChange(row){
      this.$confirm('确定要停用'+row.name+'角色吗？','系统提示',
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
      //从数据库中查询角色
      getRole(row.id).then(res=>{
        this.form = res.data.data.role
      })
      //修改title
      this.title = '修改角色'
      //打开对话框
      this.open = true
    },
    //删除按钮
    handleDelete(row){
      const roleIds = row.id || this.ids;
      this.$confirm('确定要删除编号为'+roleIds+'角色吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
        delRole(roleIds).then(res=>{
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
    //导出Excel
    handleExport(){

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
              this.getList()
            })
          }else {
            //无用户id 添加操作
            addUser(this.form).then(res=>{
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
    }
  }
}
</script>

<style scoped>

</style>
