import React, { useContext } from 'react'
import { Context } from "../index"

const Radio = () => {
    const { product, cart } = useContext(Context)
    const size = cart.getSize(product.product) ? cart.getSize(product.product) : 1
    const list = (product.product) ? JSON.parse(product.product.attribute) : false
    console.log(size)
    const changeSize = (e) => {
        product.product.price = e.target.value
        product.product.size = {
            id: e.target.attributes.dataId.value,
            title:e.target.attributes.dataTitle.value
        }
        product.setProduct(product.product)
        cart.setSize(product.product)
    }
    
    return (
        (list) &&
            <div className="switch">
                {
                    list.map((radio, i) =>
                        <label key={i} className='text-form'>
                            <input type="radio" id={"radio" + radio.id} name={"radio" + radio.group} dataId={radio.id} dataTitle={radio.title} value={radio.price} onChange={changeSize} defaultChecked={size == radio.id || size.id == radio.id }/>
                            <div className="switch-option">{radio.title}</div>
                        </label>
                    )
                }
            </div>
    )
}

export default Radio
{
    //[{"group":1,"title":"30см","checked": true}]
}