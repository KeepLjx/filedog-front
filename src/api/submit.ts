import axios from 'axios'

//发布收集
export const submit = (params: any) => {
    return axios({
        url: '/api/filedog/submit',
        method: 'post',
        data: { ...params}
    })
}
//查询文件夹表中的数据
export const cascade = () => {
    return axios({
        url: '/api/filedog/cascade',
        method: 'get',
    })
}

//检查文件名后缀
export const suffix = (params: any) => {
    return axios({
        url: '/api/filedog/suffix',
        method: 'post',
        data: { ...params}
    })
}


// 根据学生姓名获取id
export const getId = (name: string) => {
    return axios({
        url: '/api/filedog/getId',
        method: 'post',
        headers: {
            'Content-Type': 'text/plain'
        },
        data: name // 直接传递字符串
    })
}

//检查文件名后缀
export const fileRule = (params: any) => {
    return axios({
        url: '/api/filedog/fileRule',
        method: 'post',
        data: { ...params}
    })
}

//修改文件名
export const path = (params: string) => {
    return axios({
        url: '/api/filedog/newPath',
        method: 'post',
        headers: {
            'Content-Type': 'text/plain'
        },
        data: params // 直接传递字符串 
    })
}

