import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './TextCell.css';
import Cell from '../Cell';

export default props => {

    const {
        displayValue
    } = props;
    
    return (
        <Cell>
            <div className='text-container'>
                <span>{displayValue}</span>
            </div>
        </Cell>
    )

}