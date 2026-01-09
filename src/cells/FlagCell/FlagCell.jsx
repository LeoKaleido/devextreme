import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './FlagCell.css';
import Cell from '../Cell';

export default props => {

    const {
        displayValue
    } = props;

    const flagMap = useMemo(
        () => ({
            italian: 'it',
            french: 'fr',
            spanish: 'es'
        }), [displayValue]
    );

    return (
        <Cell>
            <div className='flag-container'>
                <img src={`/flags/${flagMap[displayValue]}.png`} alt="" />
            </div>
        </Cell>
    )

}