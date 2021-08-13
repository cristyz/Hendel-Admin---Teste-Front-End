import { useState, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Collection } from '../../domain/models/collection'
import { ProductCollectionItem } from '../../domain/models/product.model'
import repo from '../../data/repositories/product.repository'

// Components
import Pagination from '../../components/Pagination'
import LoadingComponent from '../../components/LoadingComponent'

// Interfaces
import { ProductFilter } from '../../domain/models/product.filter.model'

function ProductList() {
  const [productCollection, setProductCollection] = useState<Collection<ProductCollectionItem>>()
  const [status_products, setStatusProducts] = useState<string>()
  const [filter, setFilter] = useState<ProductFilter>({
    id: undefined,
    name: "",
    filter_price: "_eq",
    filter_quantity: "_eq",
    value_price: undefined,
    value_quantity: undefined
  })

  const conditions = [
    { item: '=', name: "_eq" },
    { item: '<>', name: "_not_eq" },
    { item: '>', name: "_gt" },
    { item: '>=', name: "_gteq" },
    { item: '<', name: "_lt" },
    { item: '<=', name: "_lteq" }
  ]

  const initial_filter = {
    id: undefined,
    name: "",
    filter_price: "_eq",
    filter_quantity: "_eq",
    value_price: undefined,
    value_quantity: undefined
  }

  useEffect(() => {
    // localStore pegará a última paginação do usuário
    // OBS: caso não haja localStorage o valor default será 1
    repo.getProducts(parseInt(localStorage.getItem('last_page')!), {} as ProductFilter)
      .then(setProductCollection)
  }, [])

  function getProductsPagination(page: number = 1) {
    repo.getProducts(page, filter)
      .then(data => {
        // Verificação para caso o usuário tenha feito uma busca com filtros em uma pagina que não conterá resultados 
        if (data.totalRowCount === undefined) return setStatusProducts('Nenhum resultado encontrado')
        setProductCollection(data)
      })
    // Salvará a última paginação
    localStorage.setItem('last_page', page.toString())
  }

  // Atualiza o state dos filtros
  function handleSetFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFilter(preState => ({
      ...preState,
      [name]: value
    }))
  }
  // Limpa o state dos filtros
  function handleClearFilters() {
    setStatusProducts('')
    setFilter(initial_filter)
  }

  if (productCollection) {
    return (
      <div>
        <div className="mb-2 d-flex justify-content-between">
          <h1 className="h3 text-gray-800">Listagem de produtos</h1>
          <div>
            <button onClick={handleClearFilters} className="btn btn-danger mr-3">Limpar filtros</button>
            <button onClick={() => getProductsPagination()} className="btn btn-primary">Filtrar</button>
          </div>
        </div>
        {status_products}
        <div className="card shadow mb-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered" width="100%">
                <thead className="card-header py-3">
                  <tr>
                    <th style={{ width: '120px' }}>ID</th>
                    <th>Nome</th>
                    <th style={{ width: '200px' }}>Preço</th>
                    <th style={{ width: '200px' }}>Quantidade</th>
                  </tr>
                  <tr>
                    <th className='py-1'>
                      <Form.Control size='sm' name="id" value={filter.id || ''} onChange={handleSetFilter} />
                    </th>
                    <th className='py-1'>
                      <Form.Control size='sm' name="name" value={filter.name || ''} onChange={handleSetFilter} />
                    </th>
                    <th className='py-1'>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <Form.Control as='select' size='sm' name="filter_price" value={filter.filter_price} onChange={handleSetFilter} >
                            {conditions.map((item, index) => (
                              <option value={item.name} key={index}>{item.item}</option>
                            ))}
                          </Form.Control>
                        </InputGroup.Prepend>
                        <Form.Control size='sm' name="value_price" value={filter.value_price || ''} onChange={handleSetFilter} />
                      </InputGroup>
                    </th>
                    <th className='py-1'>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <Form.Control as='select' size='sm' name="filter_quantity" value={filter.filter_quantity} onChange={handleSetFilter}>
                            {conditions.map((item, index) => (
                              <option value={item.name} key={index}>{item.item}</option>
                            ))}
                          </Form.Control>
                        </InputGroup.Prepend>
                        <Form.Control size='sm' name="value_quantity" value={filter.value_quantity || ''} onChange={handleSetFilter} />
                      </InputGroup>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productCollection.data.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td><Link to={`products/${product.id}`}>{product.name}</Link></td>
                      <td>R$ {product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination productCollection={productCollection!} getProductsPagination={getProductsPagination} />
      </div>
    )
  }

  return <LoadingComponent />

}

export default ProductList
