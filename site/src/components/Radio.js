import React, { useState } from 'react';

const Radio = ({ list }) => {
    return (
        (list) ?
            <div className="switch">
                <div className="indicator"></div>
                {
                    Array(list).map((radio, i) =>
                        <div key={i} className={(radio.checked) ? 'switch-option text-form active' : 'switch-option text-form'}>
                            <input type="radio" name={"product-" + radio.group} value={radio.title} />
                            <div>{radio.title}</div>
                        </div>
                    )
                }
            </div>
            : false
    );
};

export default Radio;
{//[{"group":1,"title":"30см","checked": true}]
}