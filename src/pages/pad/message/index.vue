
<template>
  <a-card>
    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="留言内容" prop="context">
        <el-input
            v-model="queryParams.context"
            placeholder="请输入留言内容"
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
            v-auth:permission="`system:message:add`"
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
            v-auth:permission="`system:message:remove`"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="留言编号" prop="id" width="100" />
      <el-table-column label="企业编号" prop="cno" width="120" />
      <el-table-column label="留言时间" prop="createTime" width="150" :formatter="dateFormat"/>
      <el-table-column label="留言内容" prop="context" width="150" />
      <el-table-column label="回复时间" prop="updateTime" width="150" />
      <el-table-column label="回复内容" prop="reply" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`system:message:remove`"
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
        <el-form-item label="企业编号" prop="cNo">
          <el-input v-model="form.cNo" placeholder="请输入企业编号" />
        </el-form-item>
        <el-form-item label="留言时间" prop="createTime" >
          <div class="block">
            <el-date-picker
                v-model="form.createTime"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="留言内容" prop="context">
          <el-input v-model="form.context" placeholder="请输入留言内容" />
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
import {getMessageList,removeMessage,addMessage}
  from "@/services/pad/message/message";
export default {
  name: "index",
  data(){
    return{
      page:1,//当前页
      limit:10,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      messageList:[],//留言列表
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        isDeleted:1
      },
      rules: {//表单校验
        context: [
          { required: true, message: "留言不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '留言长度必须介于 2 和 20 之间', trigger: 'blur' }
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
    // 时间格式化
    dateFormat: function(row) {
      var t = new Date(row.createTime)// row 表示一行数据, createTime 表示要格式化的字段名称
      if(!t){
        return ''
      }
      let year = t.getFullYear()
      let month = this.dateIfAddZero(t.getMonth()+1)
      let day = this.dateIfAddZero(t.getDate())
      return year + '-' + month + '-' + day
    },
    dateIfAddZero : function (time) {
      return time < 10 ? '0'+ time : time
    },
    //查询所有留言
    getList(page=1){
      this.page = page
      getMessageList(this.page,this.limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.messageList = res.data.data.messageList
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
      this.title = '添加留言'
      //清空表单
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      //打开对话框
      this.open = true
    },
    //删除按钮
    handleDelete(row){
      const id = row.id || this.ids;
      this.$confirm('确定要删除编号为'+id+'留言吗？','系统提示',
          {
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
          }).then(()=>{
        removeMessage(id).then(res=>{
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

    //提交表单
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.id != undefined){
            //有用户id 修改操作
            removeMessage(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList()
            })
          }else {
            //无用户id 添加操作
            addMessage(this.form).then(res=>{
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
