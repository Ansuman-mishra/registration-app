import React, { useEffect, useRef } from "react";
import DataTables, { Config } from "datatables.net-dt";
const CustomDataTable = ({ ...props }: Config) => {
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (tableRef.current) {
            const dt = new DataTables(tableRef.current!, {
                ...props,
                dom: "Bfrtip",
                buttons: ["excelHtml5", "print", "csvHtml5", "pdfHtml5"] as any,
            });
            return () => {
                dt.destroy();
            };
        }
    }, [props]);
    return <table ref={tableRef}></table>;
};

export default CustomDataTable;
