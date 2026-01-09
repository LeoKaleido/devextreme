import React, { useState, useEffect, useCallback, useRef, useMemo, lazy } from 'react';
import './Cell.css';

export default props => {

    const {
        children,
    } = props;

    return (
        <div className='cell-container'>
            {children}
        </div>
    )

}