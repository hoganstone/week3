import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

let productModal = '';
let delModal = '';

const app = {
    data() {
        return {
            baseUrl: "https://vue3-course-api.hexschool.io",
            api_path: "hmjbs",
            products:[],
            tempProduct:{
                imagesUrl:[],
            },
            // 用以判斷 modal 是新增用還是編輯用
            isNew: false,
        }
    },
    methods: {
        checkLogin() {
            const url = `${this.baseUrl}/v2/api/user/check`;
            axios.post(url)
            .then(res=>{
                this.getProducts();
            })
            .catch(err=>{
                alert(err.data.message);
                window.location = "./login.html";
            })
        },
        getProducts(){
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/products`; 
            axios.get(url)
            .then(res=>{
                this.products = res.data.products;
            })
            .catch(err=>{
                console.log(err.data);
            })
        },
        updateProduct(){
            // 預設為新增產品
            let url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product`;
            let httpMethod = 'post';

            // 當 isNew 為 false 時，轉換為編輯模式
            if(!this.isNew){
                url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                httpMethod = 'put'
            }

            axios[httpMethod](url,{"data":this.tempProduct})
            .then(res=>{
                alert(res.data.message);
                productModal.hide();
                this.getProducts();
            })
            .catch(err=>{
                alert(err.data.message);
            })
        },
        deleteProduct(id){
            const url = `${this.baseUrl}/v2/api/${this.api_path}/admin/product/${id}`;
            axios.delete(url)
            .then(res=>{
                alert(res.data.message);
                delModal.hide();
                this.getProducts();
            })
            .catch(err=>{
                alert(err.data.message);
            })
        },
        openModal(status, product){
            if(status === 'delete'){
                this.tempProduct = {...product};
                delModal.show();
            }else if(status === 'create'){
                this.isNew = true;
                this.tempProduct ={ imagesUrl:[] };
                productModal.show();
            }else if(status === 'edit'){
                this.isNew = false;
                this.tempProduct = {...product};
                productModal.show();
            }
        }
    },
    mounted() {
        // 登入驗證
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        // modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }
}

createApp(app).mount("#app");