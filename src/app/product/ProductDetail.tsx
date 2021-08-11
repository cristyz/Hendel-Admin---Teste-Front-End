import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Product } from '../../domain/models/product.model'

import repo from '../../data/repositories/product.repository'

interface IParams {
  id: string
}

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState<Product>()
  const [error_status, setErrorStatus] = useState<string>()

  const { id } = useParams<IParams>()

  useEffect(() => {
    repo.getProduct(parseInt(id))
      .then(setProductDetail)
      .catch(() => {
        setErrorStatus("Produto não encontrado");
      })
  }, [id])

  if (productDetail) {
    return (
      <div>
        <h1>Detalhes do produto</h1>
        <hr className="my-4" />
        <h1>ID: {productDetail.id}</h1>
        <h1>Nome: {productDetail.name}</h1>
        <h1>Preço: {productDetail.price}</h1>
        <h1>Quantidade: {productDetail.quantity}</h1>
        <h1>Descrição: {productDetail.description}</h1>
        <h1>Última atualização: {productDetail.updatedAt.toLocaleDateString()}</h1>
        <h1>Públicado em: {productDetail.createdAt.toLocaleDateString()}</h1>
      </div>
    )
  }

  if (error_status) return <h1>{error_status}</h1>

  return <h1>Carregando</h1>
}

export default ProductDetail
