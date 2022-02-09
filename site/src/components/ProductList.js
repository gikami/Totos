import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
    const { product } = useContext(Context)
    return (<div className="row row-cols-sm-3 row-cols-xl-4 gx-2 gy-3 g-md-4" > {
        (product.products) && product.products.map((product, i) =>
            <ProductItem key={i} product={product} />
        )
    } </div>
    );
});

export default ProductList;