import { useState } from "react"
import { Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

import { Product } from "../../domain/models/product.model"
import { RelatedProduct } from "../../domain/models/related-product.model"

import { IServicesRelatedsProdcts } from "../../domain/models/service.related.products"

function CardProduct({ item, ServicesRelatedsProducts, productDetail }: { item: RelatedProduct, ServicesRelatedsProducts: IServicesRelatedsProdcts, productDetail: Product }) {

    const [disable_button, setDisableButton] = useState(false)

    return (
        <Card className="my-2 mr-3" style={{ minWidth: 300 } && disable_button ? { opacity: '.3' } : { opacity: '1' }} key={item.id}>
            <Card.Body>
                <Card.Title>{item.id}</Card.Title>
                <Card.Title><Link to={`${item.id}`}>{item.name}</Link></Card.Title>
                <Card.Text>Preço: {item.price}</Card.Text>
                <Button disabled={disable_button} onClick={() => {
                    setDisableButton(true)
                    ServicesRelatedsProducts.RemoveProductOfRelateds(productDetail.id, item.id)
                }} className="btn btn-danger">{!disable_button ? 'Excluir' : 'Excluindo'}</Button>
            </Card.Body>
        </Card>
    )
}

export default CardProduct