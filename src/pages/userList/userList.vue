<template>
  <div class="user-list"><!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="key" placeholder="用户名">
            <el-button type="primary" icon="search" slot="append">搜索
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showNewUser">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table :data="filterData" style="width: 100%;" stripe>
      <el-table-column prop="UserID" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="UserLoginName" label="登录账号" width="120">
      </el-table-column>
      <el-table-column prop="UserName" label="用户名">
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template scope="scope">
          <template v-if="!(scope.row.UserName=='admin')">
            <el-button type="" size="small" @click="showEidtUser(scope.row)">编辑</el-button>
            <el-button type="" size="small" @click="showResetUser(scope.row)">重置密码</el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--新增用户-->
    <el-dialog :visible.sync="newUserVisible" title="新增用户" size="tiny">
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="95px" label-position="left">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="userForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="userForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('userForm')">重置</el-button>
        <el-button @click="submitNewUserForm('userForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑用户-->
    <el-dialog :visible.sync="editUserVisible" title="修改用户" size="tiny">
      <el-form :model="editForm" :rules="rules2" ref="editForm" label-width="95px" label-position="left">
        <el-form-item label="用户名" prop="UserName">
          <el-input v-model="editForm.UserName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitEditUserForm('editForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <!--重置密码-->
    <el-dialog :visible.sync="resetPassVisible" title="重置密码" size="tiny">
      <el-form :model="passForm" :rules="rules3" ref="passForm" label-width="95px" label-position="left">
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passForm.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitPassForm('passForm')" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAdminUserList, addUser, resetUserPassword, updateUser, deleteUser} from '../../http/api'
  //  import {Users} from '@/mock/data/user'
  import md5 from 'js-md5'

  export default {
    data () {
      let validatePass = (rule, value, callback) => {
        if (this.userForm.newPassword !== '') {
          this.$refs.userForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePass2 = (rule, value, callback) => {
        if (value !== this.userForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let validatePass3 = (rule, value, callback) => {
        if (this.passForm.newPassword !== '') {
          this.$refs.passForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePass4 = (rule, value, callback) => {
        if (value !== this.passForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        filters: {
          name: ''
        },
        key: '',
        newUserVisible: false,
        editUserVisible: false,
        resetPassVisible: false,
        user: [],
        userForm: {
          username: '',
          userLoginName: '',
          newPassword: '',
          confirmPassword: ''
        },
        editForm: {
          UserID: '',
          UserName: '',
          UserLoginName: ''
        },
        passForm: {
          userLoginName: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur,change'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur,change'},
            {validator: validatePass, trigger: 'blur,change'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认新原密码', trigger: 'blur,change'},
            {validator: validatePass2, trigger: 'blur,change'}
          ]
        },
        rules2: {
          UserName: [
            {required: true, message: '请输入用户名', trigger: 'blur,change'}
          ]
        },
        rules3: {
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur,change'},
            {validator: validatePass3, trigger: 'blur,change'}
          ],
          confirmPassword: [
            {required: true, message: '请输入确认新原密码', trigger: 'blur,change'},
            {validator: validatePass4, trigger: 'blur,change'}
          ]
        }
      }
    },
    created () {
      getAdminUserList().then(data => {
        this.user = data.users.lists
      })
    },
    computed: {
      filterData: function () {
        let key = this.key
        let data = this.user
        return data.filter(function (item) {
          return item.UserName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        })
      }
    },
    methods: {
      showNewUser () {
        this.newUserVisible = true
        this.$nextTick(() => {
          this.resetForm('userForm')
        })
      },
      showEidtUser (obj) {
        this.editUserVisible = true
        this.editForm = Object.assign({}, obj)
      },
      showResetUser (obj) {
        this.resetPassVisible = true
        this.passForm = Object.assign({}, obj)
        this.$nextTick(() => {
          this.resetForm('passForm')
        })
      },
      submitNewUserForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              UserName: this.userForm.username,
              UserLoginName: this.userForm.userLoginName,
              Password: md5(this.userForm.newPassword)
            }
            addUser(params).then(data => {
              this.$message({
                showClose: true,
                message: '新增用户成功！',
                type: 'success'
              })
              getAdminUserList().then(data => {
                this.user = data.users.lists
              })
              this.newUserVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submitEditUserForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              UserName: this.editForm.UserName,
              UserLoginName: this.editForm.UserLoginName,
              UserID: this.editForm.UserID
            }
            updateUser(params).then(() => {
              this.$message({
                showClose: true,
                message: '修改成功！',
                type: 'success'
              })
              getAdminUserList().then(data => {
                this.user = data.users.lists
              })
              this.editUserVisible = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submitPassForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              resetAccount: this.passForm.UserLoginName,
              resetpassword: md5(this.passForm.newPassword)
            }
            resetUserPassword(params).then(() => {
              this.$message({
                showClose: true,
                message: '密码更新成功！',
                type: 'success'
              })
            })
            this.resetPassVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      deleteUser (obj) {
        this.$confirm('确定删除吗?')
          .then(() => {
            deleteUser(obj.UserID).then(() => {
              this.$message({
                showClose: true,
                message: '删除成功！',
                type: 'success'
              })
              getAdminUserList().then(data => {
                this.user = data.users.lists
              })
            })
          })
          .catch(() => {
          })
      }
    }
  }
</script>

<style lang="css" scoped>
  .user-list{
    padding-bottom: 50px;
  }
</style>
