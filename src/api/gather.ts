import axios from 'axios'

//发布收集
export const gather = (params: any) => {
    return axios({
        url: '/api/filedog/gather',
        method: 'post',
        data: { ...params}
    })
}