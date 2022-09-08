<template>
  <a-card>
    <!--搜索框-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="菜单名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="permissionValue">
        <el-input
            v-model="queryParams.permissionValue"
            placeholder="请输入权限标识"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
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
            v-auth:permission="`system:menu:add`"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="el-icon-sort"
            size="mini"
            @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
    </el-row>
    <!--树形表格-->
    <el-table
        v-if="refreshTable"
        :data="menuList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="菜单名称" width="160"></el-table-column>
      <el-table-column prop="type" label="类型" width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.type ===1">菜单</span>
          <span v-else>按钮</span>
        </template>
      </el-table-column>
      <el-table-column prop="permissionValue" label="权限标识"></el-table-column>
      <el-table-column prop="path" label="组件路径"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status ===1" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-auth:permission="`system:menu:edit`"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-auth:permission="`system:menu:add`"
              v-if="scope.row.children!=null || scope.row.pid==0"
          >新增</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-auth:permission="`system:menu:remove`"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="上级菜单">
              <treeselect
                  v-model="form.pid"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item prop="permissionValue">
              <span slot="label">
                <el-tooltip content="权限标识，如：`system:user:list`" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限标识
              </span>
              <el-input v-model="form.permissionValue" placeholder="请输入权限标识" />
            </el-form-item>
          </el-col>
          <el-col :span="15" v-if="form.type===1">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`system/user/index`" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
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

/*Treeselect 多选组件*/
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getMenuList,addMenu} from "@/services/pad/system/menu";

export default {
  name: "index",
  components: { Treeselect },
  data(){
    return{
      menuList: [],// 菜单表格树数据
      menuOptions: [],// 菜单树选项
      title: "",// 弹出层标题
      open: false,// 是否显示弹出层
      isExpandAll: false,// 是否展开，默认全部折叠
      refreshTable: true,// 重新渲染表格状态
      queryParams: { // 查询参数
        menuName: undefined,
        visible: undefined
      },
      form: {
        type:1
      },// 表单参数
      rules: {// 表单校验
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        permissionValue: [
          { required: true, message: "权限标识不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    //初始化表格
    this.getList();
  },
  methods:{
    //获得菜单列表 获得树形下拉菜单
    getList(){
      this.menuOptions=[]
      getMenuList(this.queryParams)
      .then(res=>{
        console.log(res)
        this.menuList = res.data.data.perTreeList
        const nemu = {
          id: 0,
          name: '主类目',
          children: []
        }
        nemu.children = res.data.data.perTreeList
        this.menuOptions.push(nemu)
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
    //修改按钮
    handleUpdate(){},
    //删除按钮
    handleDelete(){},
    //添加按钮
    handleAdd(row){
      //修改title
      this.title = '添加菜单'
      //清空表单
      /*mouted加载table数据以后，隐藏的弹出框并没有编译渲染进dom里面
      * 没有获取到dom元素导致 'resetFields' of undefined*/
      if (this.$refs["form"] !== undefined) {
        this.$refs["form"].resetFields();
      }
      //row 不为空 则上级菜单为当前点击的菜单
      if (row != null && row.id) {
        this.form.pid = row.id;
      } else {
        //row为空 添加主类目下的菜单 即pid=0
        this.form.pid = 0;
      }
      //打开对话框
      this.open = true
    },
    //提交表单
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.id != undefined){
            //有菜单id 修改操作
           /* edit(this.form).then(res=>{
              //关闭弹框
              this.open = false
              //提示成功
              this.$message.success(res.data.message)
              //刷新页面
              this.getList()
            })*/
          }else {
            //无菜单id 添加操作
            addMenu(this.form).then(res=>{
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
    // 转换菜单数据结构
    normalizer(node) {
      //删除空的子节点
      if (node.children === null&&node.pid!=0){
        node.isDisabled=true
      }
      if (node.children === '' || node.children === undefined || node.children === null) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    // 展开  折叠操作
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    }
  }
}
</script>

<style scoped>

</style>
