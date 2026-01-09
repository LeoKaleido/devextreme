import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './CurrencyCell.css';
import Cell from '../Cell';

export default props => {

    const {
        displayValue
    } = props;

    const currencyFormatter = useMemo(
        () => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }),
    );

    return (
        <Cell>
            <div className='currency-container'>
                <span>{currencyFormatter.format(displayValue)}</span>
            </div>
        </Cell>
    )

}