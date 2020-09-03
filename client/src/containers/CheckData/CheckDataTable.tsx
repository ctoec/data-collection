import React from 'react';
import { tableColumns } from './TableColumns';
import { Child } from '../../shared/models';
import { Table } from '@ctoec/component-library';

type CheckDataTableProps = {
    reportId: number;
    reportData: Child[];
}

export const CheckDataTable: React.FC<CheckDataTableProps> = (reportId, reportData) => {
    console.log(reportData);
    return (
        <Table<Child>
            id="enrollment-report-table"
            rowKey={(row) => row.id}
            data={reportData}
            columns={tableColumns}
        />
    );
}