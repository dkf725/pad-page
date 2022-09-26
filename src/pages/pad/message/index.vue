
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
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-auth:permission="`system:message:edit`"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="留言编号" prop="id" width="100" />
      <el-table-column label="企业编号" prop="cno" width="120" />
      <el-table-column label="留言时间" prop="createTime" width="150" :formatter="dateFormat"/>
      <el-table-column label="留言内容" prop="context" width="150" />
      <el-table-column label="回复时间" prop="updateTime" width="150" :formatter="dateFormat2"/>
      <el-table-column label="回复内容" prop="reply" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`system:message:update`"
              v-if="scope.row.reply==''"
          >回复</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`system:message:edit`"
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
        <el-form-item label="留言内容" prop="reply">
          <el-input v-model="form.reply" placeholder="请输入回复内容" />
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
import {getMessageList,removeMessage,UpdateMessage}
  from "@/services/pad/message/message";
export default {
  name: "index",
  data(){
    return{
      page:1,//当前页
      limit:3,//每页记录数
      total:0,//总记录数
      queryParams:{},//条件查询对象
      messageList:[],//留言列表
      multiple: true,// 非多个禁用
      ids: [],// 选中数组
      title: "",//对话框标题
      open: false,//显示对话框
      form: {
        isDeleted:1,
        reply:''
      },
      rules: {//表单校验
        reply: [
          { required: true, message: "回复不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '回复长度必须介于 2 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //初始化角色列表
    this.getList(this.page,this.limit)
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
    dateFormat2: function(row) {
      var t = new Date(row.updateTime)// row 表示一行数据, createTime 表示要格式化的字段名称
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
    getList(page,limit){
      getMessageList(page,limit,this.queryParams)
          .then(res=>{
            console.log(res)
            this.messageList = res.data.data.messageList
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
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
      console.log(this.ids)
      console.log(this.multiple)
    },
    //修改按钮
    handleUpdate(row){
      //从数据库中查询留言
      this.form={
        id:row.id
      }
      //修改title
      this.title = '回复留言'
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
            this.getList(this.page,this.limit)
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
          UpdateMessage(this.form).then(res=>{
            this.$message.success(res.data.message)
            this.getList(this.page,this.limit)
          })
          this.open = false
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
