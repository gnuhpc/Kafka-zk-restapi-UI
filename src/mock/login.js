const menuList={
    "power":[
        {
            "content":"总揽",
            "url":"main"
        },
        {
            "content":"云平台",
            "submenu":[
                {
                    "content":"关系数据库",
                    "url":"sql"
                }
            ]
        }
    ]
    // "reply": {
    //   "returnCode": {
    //     "domain": null,
    //     "type": "S",
    //     "code": "AAAAAA"
    //   },
    //   "menuTree": {
    //     "id": "-1",
    //     "parentId": "",
    //     "parent": false,
    //     "children": [
    //       {
    //         "id": "M0000000000000000527",
    //         "parentId": "Root",
    //         "parent": false,
    //         "children": [
    //           {
    //             "id": "M0000000000000000528",
    //             "parentId": "M0000000000000000527",
    //             "parent": true,
    //             "children": [],
    //             "text": "模块列表",
    //             "attributes": [
    //               {
    //                 "action": "cmbc.component.manager.index"
    //               }
    //             ]
    //           }
    //         ],
    //         "text": "模块管理",
    //         "attributes": [
    //           {
    //             "action": ""
    //           }
    //         ]
    //       },
    //       {
    //         "id": "M0000000000000000012",
    //         "parentId": "Root",
    //         "parent": false,
    //         "children": [
    //           {
    //             "id": "M0000000000000000015",
    //             "parentId": "M0000000000000000012",
    //             "parent": true,
    //             "children": [],
    //             "text": "权限管理",
    //             "attributes": [
    //               {
    //                 "action": "cmbc.rbac.perm.index"
    //               }
    //             ]
    //           },
    //           {
    //             "id": "M0000000000000000014",
    //             "parentId": "M0000000000000000012",
    //             "parent": true,
    //             "children": [],
    //             "text": "Function管理",
    //             "attributes": [
    //               {
    //                 "action": "cmbc.rbac.func.index"
    //               }
    //             ]
    //           }
    //         ],
    //         "text": "开发管理",
    //         "attributes": [
    //           {
    //             "action": ""
    //           }
    //         ]
    //       }
    //     ],
    //     "text": "顶级节点",
    //     "attributes": null
    //   }
    // }
  }
  export default{
    loginByUsername:()=>{
          return menuList;
      }
  }
  