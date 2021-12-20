import React, { useState } from 'react';

const Radio = ({ list }) => {
    const [statRadio, setStatRadio] = useState(1);
    const radioList = (list) ? (Array(list).length > 0) ? list : Array(list) : false;
    return (
        (radioList) ?
            <div className="switch">
                <div className="indicator"></div>
                {
                    radioList.map((radio, i) =>
                        <div key={i} className={(radio.id === statRadio) ? 'switch-option text-form active' : 'switch-option text-form'}>
                            <input type="radio" name={"product-" + radio.group} value={radio.title} onChange={() => setStatRadio(radio.id)} />
                            <div>{radio.title}</div>
                        </div>
                    )
                }
            </div>
            : null
    );
};

export default Radio;
