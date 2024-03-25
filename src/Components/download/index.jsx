import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './download.css';

const DownloadPDF = ({ data }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Sale", dataKey: "sale" },
      { header: "Profit", dataKey: "profit" },
      { header: "Buybox", dataKey: "buybox" },
      { header: "Inventory", dataKey: "inventory" },
      { header: "Order Shipped", dataKey: "order_shipped" },
      { header: "Sales Timestamp", dataKey: "sales_timestamp", format: formatDate },
      { header: "Total Sales", dataKey: "total_sales_usd" },
      { header: "Best Selling Category", dataKey: "best_selling_category" },
      { header: "Total Orders", dataKey: "total_orders" },
      { header: "Products Sold", dataKey: "total_products_sold" },
      { header: "Order Pending", dataKey: "order_not_shipped" },
      { header: "Order Received", dataKey: "order_received" },
      { header: "Loading Status", dataKey: "product_loading_status" },
      { header: "Traffic", dataKey: "store_traffic" },
    ];

    const tableData = data.map((object) =>
      columns.map((column) => {
        if (typeof column.dataKey === "string") {
          return object[column.dataKey];
        } else if (typeof column.dataKey === "function") {
          return column.dataKey(object);
        }
        return "";
      })
    );

    const tableProps = {
      startY: 20,
      margin: { top: 20 },
      styles: {
        fontSize: 8, // Adjust the font size as needed
      },
    };

    doc.autoTable({
      head: [columns.map((column) => column.header)],
      body: tableData,
      ...tableProps,
    });

    doc.save('data.pdf');
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download data</button>
    </div>
  );
};

export default DownloadPDF;
