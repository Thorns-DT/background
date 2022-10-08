<template>
  <div>
    <div style="margin: 10px 0">
      <el-button @click="userAdd" type="primary">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      
      <el-upload action="http://localhost:8081/user/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
      </el-upload>

      <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>
    </div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>
      <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="primary" @click="reset">重置</el-button>
    </div>
    <el-table 
      :data="tableData"  
      border stripe :header-cell-class-name="headerBg"
      @selection-change="handleSelectionChange"
    >

      
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="用户ID" width="140">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="80">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="80">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="100">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="100">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="150">
      </el-table-column>
      <el-table-column label="操作"  width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleUpdate(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>


          <el-popconfirm
              confirm-button-text='确定删除'
              cancel-button-text='不用删除'
              icon="el-icon-info"
              icon-color="red"
              title="这是一段内容确定删除吗？"
              class="ml-5"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm> 

        </template>
      </el-table-column>
    </el-table>

    <!-- 表格 -->
    
    <!-- Form -->

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-input v-model="form.avatarUrl" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

      
    




    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'HomeView',
  data(){
    return {
      tableData:[],
      total:0,
      pageNum:1,
      pageSize: 5,
      username: "",
      nickname: "",
      email: "",
      address: "",
      phone: "",

      headerBg: 'headerBg',
      dialogFormVisible: false,
      multipleSelection: [],

      form: {},
      formLabelWidth: '70px'
    }
  },
  created(){
    this.load()
  },
  methods:{
    load() {
      request.get("/user/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          email: this.email,
          address: this.address,
        }
      }).then(res => {

        console.log(res.data)
        this.tableData = res.data.records
        this.total = res.data.total

      })
    },

    userAdd(){
      this.dialogFormVisible = true
      form = {}
    },
    save(){

      request.post("/user/save",this.form).then(res=>{
        if(res.data){
          this.dialogFormVisible = false
          this.$message.success("保存成功")
          this.load()
        }else{
          this.$message.error("保存失败")
        }
      })

    },

    handleUpdate(row){
      this.form= JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },

    handleDelete(id){
      request.delete("/user/"+id).then(res=>{
        if(res){
          this.dialogFormVisible = false
          this.$message.success("删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })

    },

    reset(){
      this.username = "",
      this.email = "",
      this.address = "",
      this.load()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    deleteBatch(){
      let ids = this.multipleSelection.map(v => v.id)
      request.delete("/user/deleteBatch",ids).then(res=>{
        if(res.data){
          this.dialogFormVisible = false
          this.$message.success("删除成功")
          this.load()
        }else{
          this.$message.error("删除失败")
        }
      })
    },


    collapse() {  // 点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {  // 收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {   // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },

    handleExcelImportSuccess() {
      this.$message.success("导入成功")
      this.load()
    },
    exp() {
      window.open("http://localhost:8081/user/export")
    }

  }

  
}
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .headerBg {
    background: #eee!important;
  }
</style>
