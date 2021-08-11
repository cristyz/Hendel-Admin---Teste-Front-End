/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Collection } from '../../domain/models/collection'
import { ProductCollectionItem } from '../../domain/models/product.model'

export default function ButtonsPages({ productCollection, getProductsPagination }: { productCollection: Collection<ProductCollectionItem>, getProductsPagination: Function, }) {
    const [pageButtons, setPageButtons] = useState<Array<number>>([])

    useEffect(() => {
        calculateMaxVisible()
    }, [productCollection])

    function calculateMaxVisible() {
        let pagesButtons = []
        const maxVisibleButtons = 7
        let totalPages = Math.ceil(productCollection.totalRowCount / productCollection.pageSize)
        let maxLeft = (productCollection.currentPage - Math.floor(maxVisibleButtons / 2))
        let maxRight = (productCollection.currentPage + Math.floor(maxVisibleButtons / 2))

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = maxVisibleButtons
        }

        if (maxRight > totalPages) {
            maxLeft = totalPages - (maxVisibleButtons - 1)
            maxRight = totalPages

            if (maxLeft < 1) maxLeft = 1
        }

        for (let page = maxLeft; page <= maxRight; page++) {
            pagesButtons.push(page)
        }

        setPageButtons(pagesButtons)
    }

    return (
        <nav className="d-flex justify-content-center" aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item"><button onClick={() => getProductsPagination(productCollection.prevPage || 1)} disabled={!productCollection.prevPage && true} className={`page-link ${!productCollection?.prevPage && "btn btn-light"}`}>Anterior</button></li>
                {pageButtons.map(page => (
                    <li key={page} className="page-item"><button onClick={() => getProductsPagination(page)} className={`page-link ${productCollection.currentPage === page && 'bg-primary text-white'}`}>{page}</button></li>
                ))}
                <li className="page-item"><button onClick={() => getProductsPagination(productCollection.nextPage || 1)} disabled={!productCollection.nextPage && true} className={`page-link ${!productCollection?.nextPage && "btn btn-light"}`}>Próxima</button></li>
            </ul>
        </nav>
    )
}