import React, { useContext } from "react"
import { observer } from "mobx-react-lite"
import { Context } from "../index"
import ProductItem from "./ProductItem"
import { Element } from "react-scroll"
import { toJS } from 'mobx';

const ProductList = observer(() => {
    const { product } = useContext(Context)

    return product.products && product.products.map(category => {
        
        return <>
            {
                category.item && <Element name={category.item.id} className="element">
                    <h4 className="mb-4 fw-6">{category.item.title}</h4>
                </Element>
            }
                
            <div className="row row-cols-sm-3 row-cols-xl-4 gx-2 gy-3 g-md-4">
                {
                    category.products && category.products.map(product => <ProductItem key={product.id} product={product} />)
                }
            </div>
            {
                category.subProducts &&  
                    category.subProducts.map(product => {
                        return <>
                            <div className="element">
                                <h5 className="mb-4">{product[0].title}</h5>
                            </div>
                            <div className="row row-cols-sm-3 row-cols-xl-4 gx-2 gy-3 g-md-4">
                                {
                                    product[0].products.map(subproduct => {
                                        return <ProductItem key={subproduct.id} product={subproduct} />
                                    })
                                }
                            </div>
                        </>
                    })
                  
            }
        </>
    })
});

export default ProductList