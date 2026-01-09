import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client'
import './App.css';
import notify from 'devextreme/ui/notify';
import 'devextreme/dist/css/dx.light.css';
import { Column, DataGrid, Editing, FilterBuilder, FilterPanel, FilterRow, HeaderFilter, Pager, Paging, Sorting } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import DataSource from 'devextreme/data/data_source';
import DateCell from './cells/DateCell/DateCell';
import TextCell from './cells/TextCell/TextCell';
import FlagCell from './cells/FlagCell/FlagCell';
import CurrencyCell from './cells/ActionsCell/ActionsCell';
import { ColorBox, TextBox } from 'devextreme-react';
import { DateBox } from 'devextreme-react/date-box';
import { DateRangeBox } from 'devextreme-react/date-range-box';
import { serverOrigin } from './hardcoded';

function App() {

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const dataGridRef = useRef(null);
    const [filterValue, setFilterValue] = useState(null);

    const showMessage = useCallback(
        message => {
            notify({
                message,
                width: 300
            }, 'info', 500);
        }, []
    );

    const handleRefresh = useCallback(
        () => {
            dataGridRef.current.instance.refresh();
        }, [dataGridRef]
    );

    const handleAddNew = useCallback(
        () => {
            showMessage('add')
        }, []
    );

    const handleEdit = useCallback(
        () => {
            showMessage('edit');
        }, [selectedRows]
    );

    const handleDelete = useCallback(
        () => {
            if (selectedRows.length > 0) {
                const newData = data.filter(item => !selectedRows.includes(item.id));
                setData(newData);
                setSelectedRows([]);
            }
        }, [selectedRows, data]
    );

    const handleExport = useCallback(
        () => {
            showMessage('export');
        }, []
    );

    const onSelectionChanged = useCallback(
        e => {
            setSelectedRows(e.selectedRowKeys);
        }, []
    );

    const test = useCallback(
        e => {
        }, []
    );

    const dataSource = useMemo(() => {
        return new DataSource({
            load: loadOptions => {
                let mergedFilter = null;
                if (filterValue && loadOptions.filter) {
                    mergedFilter = ['and', filterValue, loadOptions.filter];
                } else {
                    mergedFilter = filterValue || loadOptions.filter || null;
                }
                const { skip = 0, take = 15 } = loadOptions;
                return fetch(`${serverOrigin}/orders?skip=${skip}&take=${take}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        filters: mergedFilter,
                        sort: loadOptions.sort
                    })
                })
                    .then(r => r.json())
                    .then(result => {
                        const orders = result.orders.map(
                            order => ({
                                ...order,
                                total: (Math.random() * 8000).toFixed(2)
                            })
                        )
                        return {
                            data: orders,
                            totalCount: result.total
                        }
                    });
            },
            remove: (...a) => {
                console.log(a);
            },

            paginate: true
        })
    }, [filterValue]);

    const headerFilterDataSource = useMemo(() => ({
        load: (loadOptions) => {
            const { skip = 0, take = 15 } = loadOptions;
            return fetch(`${serverOrigin}/orders?skip=${skip}&take=${take}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    group: [{ selector: 'orders_id', isExpanded: false }]
                })
            })
            .then(r => r.json())
            .then(result => {
                console.log(result.orders.map(item => ({
                    text: 'id',
                    value: item.orders_id
                })));

                return result.orders.map(item => ({
                    text: 'id: '+ item.orders_id,
                    value: item.orders_id
                }));
            });
        }
    }), []);

    const ep = useCallback(e => {
        if (e.parentType === 'filterRow' && e.dataField === 'date_purchased') {
            e.cancel = true;
            const container = document.createElement('div');
            e.editorElement.appendChild(container);

            ReactDOM.createRoot(container).render(
                <DateRangeBox
                    multiView={false}
                    onEndDateChange={value => e.setValue(value)}
                    onStartDateChange={value => e.setValue(value)}
                />
            );
        }
    }, []);

    const customOperations = [{
        name: "isZero",
        caption: "Is Zero",
        dataTypes: ["number"],
        hasValue: false,
        calculateFilterExpression: function(filterValue, field) {
            return [field.dataField, "=", 0];
        }
    }];

    useEffect(
        () => { }, []
    );

    return (
        <div className="App">

            <div className="kalei__datagrid">

                <h2>Ordini</h2>

                <div className="kalei__toolbar">
                    <Button text="Nuovo" type="success" icon="plus" onClick={handleAddNew} />
                    <Button text="Modifica" type="normal" icon="edit" onClick={handleEdit} disabled={selectedRows.length !== 1} />
                    <Button text="Elimina" type="danger" icon="trash" onClick={handleDelete} disabled={selectedRows.length === 0} />
                    <Button text="Aggiorna" type="normal" icon="refresh" onClick={handleRefresh} />
                    <Button text="Esporta Excel" type="normal" icon="exportxlsx" onClick={handleExport} />
                </div>

                <DataGrid
                    onEditorPreparing={ep}
                    ref={dataGridRef}
                    dataSource={dataSource}
                    keyExpr="orders_id"
                    showBorders={true}
                    showRowLines={true}
                    showColumnLines={true}
                    hoverStateEnabled={true}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                    selection={{
                        mode: 'single',
                        showCheckBoxesMode: 'always',
                    }}
                    remoteOperations={true}
                    onRowClick={test}
                    onCellHoverChanged={test}
                    onSelectionChanged={onSelectionChanged}
                    searchPanel={{
                        visible: true,
                        placeholder: "Cerca nei dati..."
                    }}
                    groupPanel={{ visible: true }}
                    export={{
                        enabled: true,
                        fileName: 'dati_export'
                    }}

                >
                    <Sorting mode="single" />
                    <Editing mode="cell" allowUpdating={true} allowAdding={true} allowDeleting={true} />
                    <FilterBuilder fields={{}} customOperations={customOperations} />
                    <FilterPanel visible={true} />
                    <HeaderFilter visible={true} />
                    <FilterRow visible={true} applyFilter="onClick" />
                    <Column  caption={'ID'} cellRender={TextCell} dataField="orders_id" filterOperations={['anyof', 'noneof', 'contains', '=']} selectedFilterOperation={'='}>
                        <HeaderFilter allowSearch={true} dataSource={headerFilterDataSource} />
                    </Column>
                    <Column allowEditing={true} caption={'Sito'} cellRender={FlagCell} dataField="orders_language"/>
                    <Column allowEditing={true} caption={'Clienti'} cellRender={TextCell} dataField="customers_name" />
                    <Column allowEditing={true} caption={'Totale ordine'} cellRender={CurrencyCell} dataField="total" dataType="number" />
                    <Column allowEditing={true} caption={'Data di acquisto'} selectedFilterOperation={'='} filterOperations={['=']} cellRender={DateCell} dataField="date_purchased" dataType="date" />
                    <Column allowEditing={true} caption={'Metodo di pagamento'} cellRender={TextCell} dataField="payment_method" />
                    <Column allowFiltering={false} caption={'Stato dell\'ordine'} cellRender={TextCell} dataField="orders_status_name" />
                    <Paging defaultPageSize={10} />
                    <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20, 50]} showNavigationButtons={true} visible={true}/>
                </DataGrid>
            </div>
        </div>
    );
}


export default App;
