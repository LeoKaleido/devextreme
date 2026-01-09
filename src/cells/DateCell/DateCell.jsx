import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './DateCell.css';
import Cell from '../Cell';

export default props => {

    const {
        displayValue
    } = props;

    const date = useMemo(
        () => new Date(displayValue), [displayValue]
    );

    const dateFormatter = new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <Cell>
            <div className='date-container'>
                <span>{dateFormatter.format(date)}</span>
            </div>
        </Cell>
    )

}