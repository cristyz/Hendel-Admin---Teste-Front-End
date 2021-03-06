import { Collection } from '../../domain/models/collection'
import { ProductFilter } from '../../domain/models/product.filter.model'
import { Product, ProductCollectionItem } from '../../domain/models/product.model'
import { RelatedProduct } from '../../domain/models/related-product.model'
import { ProductRepositoty } from '../../domain/repositories/product.repository'
import { httpClient } from '../config/http-client'
import { productCollectionMapper, productMapper, relatedProductMapper } from '../mappers/product.mapper'

export class IProductDepository implements ProductRepositoty {
  async getProducts(page: number = 1, filter: ProductFilter): Promise<Collection<ProductCollectionItem>> {

    const { id, name, value_price, filter_price, value_quantity, filter_quantity } = filter

    let urlFilterArray = [`products?page=${page}&page_size=20`]

    id && urlFilterArray.push(`q[id_eq]=${id}`)

    name && urlFilterArray.push(`q[name_cont]=${name}`)

    value_price && urlFilterArray.push(`q[price${filter_price}]=${value_price}`)

    value_quantity && urlFilterArray.push(`q[quantity${filter_quantity}]=${value_quantity}`)

    // urlFilter será a junção de todos os filtros criados pelo usuário
    let urlFilter = urlFilterArray.join('&')

    const response = await httpClient.get(urlFilter)
    return productCollectionMapper(response.data)
  }

  async getProduct(id: number): Promise<Product> {
    const urlID = `products/${id}`
    const response = await httpClient.get(urlID)
    return productMapper(response.data)
  }
  updateProduct(id: number, attributes: Record<string, any>): Promise<Product> {
    throw new Error('Method not implemented.')
  }
  createProduct(attributes: Record<string, any>): Promise<Product> {
    throw new Error('Method not implemented.')
  }
  deleteProduct(id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async addRelatedProduct(productId: number, relatedProductId: number): Promise<RelatedProduct> {
    const urlID = `products/${productId}/related_products`
    const response = await httpClient.post(urlID, { related_product_id: relatedProductId })
    return relatedProductMapper(response.data)
  }
  async removeRelatedProduct(productId: number, relatedProductId: number): Promise<void> {
    const urlID = `products/${productId}/related_products/${relatedProductId}`
    const response = await httpClient.delete(urlID)
    return response.data
  }
}

export default new IProductDepository()
