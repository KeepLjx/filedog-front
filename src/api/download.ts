import axios from 'axios'

//将文件插入文件表
export const insertFile = (params: any) => {
    return axios({
        url: '/api/filedog/insertFile',
        method: 'post',
        data: { ...params}
    })
}

//查找文件表中的数据并显示
export const findFiles = (params: any) => {
    return axios({
        url: '/api/filedog/findFiles',
        method: 'post',
        headers: {
            'Content-Type': 'text/plain'
        },
        data: params
    })
}

//删除单个文件
export const deleteFile = (params: string[]) => {
    return axios({
        url: '/api/filedog/delete',
        method: 'post',
        headers: {
            'Content-Type': 'text/plain'
        },
        data: params
    })
}

//删除整个文件夹
export const deleteFolder = (params: any) => {
    return axios({
        url: '/api/filedog/deleteFolder',
        method: 'post',
        data: { ...params}
    })
}

//批量删除文件
export const deleteBatch = (params: string[]) => {
    return axios({
        url: '/api/filedog/deleteBatch',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: params
    })
}