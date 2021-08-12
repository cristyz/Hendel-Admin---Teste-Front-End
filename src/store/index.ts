import { StoreType } from 'vuex-but-for-react'
import repo from '../data/repositories/product.repository'
import { ProductFilter } from '../domain/models/product.filter.model'

const store: StoreType = {
    state: {
        products: []
    },
    mutations: {
        REFRESH_DATA_PRODUCTS(state, data) {
            state.products = state.products.concat(data)
        }
    },
    actions: {
        async LOAD_DATA_PRODUCTS(context) {
            repo.getProducts(parseInt(localStorage.getItem('last_page')!), {} as ProductFilter)
                .then(products => {
                    context.mutations.REFRESH_DATA_PRODUCTS(products)
                })
        }
    },
    getters: {
        dataProducts(state) {
            return state.products
        }
    }
}

export default store