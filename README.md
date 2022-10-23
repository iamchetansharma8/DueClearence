# DueClearence
Major Project (Stage 1)

# Installation
1. Clone the repository
```
git clone "https://github.com/iamchetansharma8/dueclearence.git"
```
2. Open terminal and navigate to dueclearence.
3. Install node_modules
  ```
   npm install
  ```
4. Run application in dev mode locally by :
  ```
   npm run dev
  ```
  # History
  1. Authentication completed using google OAuth 2.0 strategy
  2. Department functionality added : create new department, change super admin of existing department, add sub admin to a given department, revoke subadmin rights of a subadmin
  
  ## - Create new department
  Can be done by institute level admin only, need to supply name (of department) and superAdminEmail (email of super admin of this new department) attached with req.body in the concerned POST request
  ## - Change super-admin of existing department
  Can be done by institute level admin only, need to supply name (of department) and newSuperAdminEmail (email of the new super admin of concerned department) attached with req.body in the concerned POST request
  ## - Add sub-admin to a given department
  Can be done by super-admin of concerned department only, need to supply name (of department) and newAdminEmail (email of the new sub admin to be added) attached with req.body in the concerned POST request
  ## - Revoke sub-admin rights of a user from a given department
  Can be done by super-admin of concerned department only, need to supply name (of department) and oldSubAdminEmail (email of the old sub admin to be removed) attached with req.body in the concerned POST request
