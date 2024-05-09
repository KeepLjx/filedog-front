<template>
    <el-cascader v-model="value" :options="options" :props="{ expandTrigger: 'hover' }" placeholder="请选择文件夹"
        @change="handleChange"></el-cascader>
</template>


<script>
import {
    suffix,
    cascade,
    fileRule,
} from '../api/submit'
export default {
    data() {
        return {
            value: [],
            options: [],
            suffix: '',
            file_rule: '',
        };
    },
    mounted() {
        cascade().then((response) => {
            // 数据预处理，将数据结构转换为期望的格式
            let tempOptions = []; // 用于存储处理后的数据
            let collectors = new Set(); // 使用Set来存储所有独特的收集人，避免重复
            // 遍历返回的数据，为每个收集人创建一个选项
            response.data.data.forEach(item => {
                // 如果收集人名字为空，则不处理这个条目
                if (item.collector.trim() === "") return;

                // 如果这个收集人还没被处理过，添加到tempOptions中
                if (!collectors.has(item.collector)) {
                    collectors.add(item.collector);
                    tempOptions.push({
                        value: item.collector,
                        label: item.collector,
                        children: []
                    });
                }
                // 找到这个收集人的对象，并为其添加子项
                let collectorOption = tempOptions.find(option => option.value === item.collector);
                collectorOption.children.push({
                    value: item.folderName,
                    label: item.folderName
                });
            });
            // 赋值处理后的数据到组件的options变量
            this.options = tempOptions;
        }).catch((error) => {
            // 处理错误
            console.error("Error fetching data: ", error);
        });
    },
    methods: {
        handleChange(value) {
            this.value = value;
            this.$emit('update:value', this.value);
            var params = {
                value: this.value,
            }
            suffix(params).then(res => {
                this.suffix = res.data.data;
                this.$emit('update:suffix', this.suffix);
            })
            fileRule(params).then(res => {
                this.file_rule = res.data.data;
                this.$emit('update:file_rule', this.file_rule);
            })

        },
    }
};
</script>

<style></style>