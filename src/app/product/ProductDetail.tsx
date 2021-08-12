import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { Product } from '../../domain/models/product.model'
import { RelatedProduct } from '../../domain/models/related-product.model'
import { IServicesRelatedsProdcts } from '../../domain/models/service.related.products'

import repo from '../../data/repositories/product.repository'
// Components
import CardProduct from '../../components/CardProducts'
import LoadingComponent from '../../components/LoadingComponent'

interface IParams {
  id: string
}

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState<Product>()
  // O state "products_relateds" servirá para mostrar os produtos relacionados sem precisar fazer um nova requisição após adicionar ou remover um produto
  const [products_relateds, setProductsRelateds] = useState<RelatedProduct[]>()
  const [add_product_related_status, setAddRelatedProductStatus] = useState<string>()
  const [removed_product_related_status, setRemovedRelatedProductStatus] = useState<string>()
  const [value_ID_for_add_related_product, setValueIDForAddProductRelated] = useState<number>()
  const [error_status, setErrorStatus] = useState<string>()

  const { id } = useParams<IParams>()

  useEffect(() => {
    repo.getProduct(parseInt(id))
      .then(data => {
        setProductDetail(data);
        setProductsRelateds(data.relatedProducts);
      })
      .catch(() => {
        setErrorStatus("Produto não encontrado");
      })
  }, [id])

  function handleValueInput(event: React.ChangeEvent<HTMLInputElement>) {
    setValueIDForAddProductRelated(parseInt(event.target.value))
  }

  const ServicesRelatedsProducts: IServicesRelatedsProdcts = {
    RemoveProductOfRelateds(productDetailID: number, itemID: number) {
      repo.removeRelatedProduct(productDetail!.id, itemID)
        .then(() => {
          setRemovedRelatedProductStatus(`Produto de ID: ${itemID} removido dos relacionados`)
          // Se o produto foi removido, ocorrerá um filter no products_relateds removendo o produto
          setProductsRelateds(products_relateds!.filter((product) => product.id !== itemID))
        })
        .catch(() => {
          setRemovedRelatedProductStatus(`Erro ao tentar remover produto de ID: ${itemID} dos relacionados`)
        })
    },
    AddProductOfRelateds(event: React.FormEvent) {
      event.preventDefault()
      setRemovedRelatedProductStatus('')
      // Verifica se o campo de input está vazio
      if (!value_ID_for_add_related_product) return setAddRelatedProductStatus('Digite um ID para adicionar um produto aos relacionados')
      // Verifica se o produto já está na lista de produtos relacionados
      for (const item of products_relateds!) {
        if (item.id === value_ID_for_add_related_product) return setAddRelatedProductStatus('Produto já está nos relacionados')
      }
      // Adiciona o produto a lista de produtos relacionados
      repo.addRelatedProduct(productDetail!.id, value_ID_for_add_related_product!)
        .then(data => {
          setAddRelatedProductStatus('Adicionado com sucesso')
          setProductsRelateds(products_relateds?.concat(data))
        }).catch(() => {
          setAddRelatedProductStatus('ID do produto não encontrado')
        })
    },
    setRemovedRelatedProductStatus,
    setAddRelatedProductStatus
  }

  if (productDetail) return (
    <div>
      <div className="border-top border-bottom">
        <h1 className="text-uppercase">Detalhes do produto</h1>
        <h1 className="my-3 ">ID: {productDetail.id}</h1>
        <h1 className="my-3 ">Nome: {productDetail.name}</h1>
        <h1 className="my-3 ">Preço: {productDetail.price}</h1>
        <h1 className="my-3 ">Quantidade: {productDetail.quantity}</h1>
        <h1 className="my-3 ">Descrição: {productDetail.description}</h1>
        <h1 className="my-3 ">Última atualização: {productDetail.updatedAt.toLocaleDateString()}</h1>
        <h1 className="my-3 ">Públicado em: {productDetail.createdAt.toLocaleDateString()}</h1>
      </div>
      {/* ------------------------------------------------------------------------ */}
      <div className="border-bottom">
        <h1>Produtos Relacionados</h1>
        <div className="d-flex flex-wrap">
          {products_relateds &&
            products_relateds.length > 0 ?
            products_relateds?.map((item) => <CardProduct key={item.id} ServicesRelatedsProducts={ServicesRelatedsProducts} item={item} productDetail={productDetail} />)
            : <text className="my-4">Nenhum produto relacionado</text>}
        </div>
        {removed_product_related_status}
      </div>
      {/* ------------------------------------------------------------------------ */}
      <div>
        <h1>Adicionar produto aos relacionados</h1>
        <Form onSubmit={event => ServicesRelatedsProducts.AddProductOfRelateds(event)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ID do produto:</Form.Label>
            <Form.Control type="number" onChange={handleValueInput} />
            <Form.Text className="text-muted">
              {add_product_related_status}
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Adicionar
          </Button>
        </Form>
      </div>
    </div>
  )

  if (error_status) return <h1>{error_status}</h1>

  return <LoadingComponent />
}

export default ProductDetail
