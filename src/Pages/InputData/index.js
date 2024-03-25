import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './inputdata.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "../../Components/Navbar";
import { read, utils } from "xlsx";

function InputData() {
  const { userId } = useParams();
  const [showCalendar, setShowCalendar] = useState(true);
  const [product, setProduct] = useState({
    sale: 0,
    best_selling_category: "",
    profit: 0,
    buybox: false,
    inventory: null,
    order_shipped: null,
    sales_timestamp: new Date(),
    total_sales_usd: 0,
    total_orders: 0,
    total_products_sold: 0,
    user_id: userId,
    order_not_shipped: null,
    order_received: "",
    product_loading_status: "",
    store_traffic: null,
  });
  const categories = [
    "Electronics",
    "Clothing, Shoes, and Jewelry",
    "Home and Kitchen",
    "Beauty and Personal Care",
    "Health and Household",
    "Books",
    "Movies, Music, and Games",
    "Sports and Outdoors",
    "Toys and Games",
    "Automotive",
    "Tools and Home Improvement",
    "Baby",
    "Office Products",
    "Pet Supplies",
    "Groceries and Gourmet Food"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "number" ? parseFloat(value) : value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: newValue,
    }));
  };
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      // Parse the Excel file or process its data here
      const excelData = event.target.result;
      // Extract the relevant fields and set them in the product state
      const extractedFields = extractFieldsFromExcel(excelData);
      setProduct((prevProduct) => ({
        ...prevProduct,
        ...extractedFields,
      }));
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://45.80.153.244/products/createProduct', product);

      console.log("data ", product)
      setProduct({
        // reset form fields after successful submission
        sale: 0,
        best_selling_category: "",
        profit: 0,
        buybox: false,
        inventory: null,
        order_shipped: null,
        sales_timestamp: new Date(),
        total_sales_usd: 0,
        total_orders: 0,
        total_products_sold: 0,
        user_id: userId,
        order_not_shipped: null,
        order_received: 0,
        product_loading_status: "",
        store_traffic: null, 
      });
    } catch (error) {
      window.alert("Failed to Post Data:", error);
    }
  };

  const handleDateChange = (date, name) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
     [name]: date,
    }));
  };

  const handleCalendarClose = () => {
    setShowCalendar(false);
  };

  function extractFieldsFromExcel(excelData) {
    const workbook = read(excelData, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = utils.sheet_to_json(worksheet, { header: 1 });
  
    // Assuming the relevant fields are in specific columns
    const sale = parseFloat(parsedData[1][0]);
    const bestSellingCategory = parsedData[1][1];
    const profit = parseFloat(parsedData[1][2]);
    const buybox = Boolean(parsedData[1][3]);
    const inventory = parseFloat(parsedData[1][4]);
    const orderShipped = parseFloat(parsedData[1][5]);
    const salesTimestamp = new Date(parsedData[1][6]);
    const totalSalesUSD = parseFloat(parsedData[1][7]);
    const totalOrders = parseFloat(parsedData[1][8]);
    const totalProductsSold = parseFloat(parsedData[1][9]);
    const orderNotShipped = parseFloat(parsedData[1][10]);
    const orderReceived = parseFloat(parsedData[1][11]);
    const productLoadingStatus = parsedData[1][12];
    const storeTraffic = parseFloat(parsedData[1][13]);
  
    return {
      sale,
      best_selling_category: bestSellingCategory,
      profit,
      buybox,
      inventory,
      order_shipped: orderShipped,
      sales_timestamp: salesTimestamp,
      total_sales_usd: totalSalesUSD,
      total_orders: totalOrders,
      total_products_sold: totalProductsSold,
      order_not_shipped: orderNotShipped,
      order_received: orderReceived,
      product_loading_status: productLoadingStatus,
      
    };
  }
  
  
  return (
    <>
      <NavBar />
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Sale:
          <input
            type="number"
            name="sale"
            value={product.sale}
            onChange={handleChange}
          />
        </label>
        <label>
          Best Selling Category:
          <select
            name="best_selling_category"
            value={product.best_selling_category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Profit:
          <input
            type="number"
            name="profit"
            value={product.profit}
            onChange={handleChange}
          />
        </label>
        <label>
          BuyBox:
          <input
            type="checkbox"
            name="buybox"
            checked={product.buybox}
            onChange={handleChange}
          />
        </label>
        <label>
          Inventory:
          <input
            type="number"
            name="inventory"
            value={product.inventory || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Order Shipped:
          <input
            type="number"
            name="order_shipped"
            value={product.order_shipped || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Sales Timestamp:
          <DatePicker
            selected={product.sales_timestamp}
            onChange={(date) => handleDateChange(date, "sales_timestamp")}
            onCalendarClose={handleCalendarClose}
          />
        </label>
        <label>
          Total Sales (USD):
          <input
            type="number"
            name="total_sales_usd"
            value={product.total_sales_usd}
            onChange={handleChange}
          />
        </label>
        <label>
          Total Orders:
          <input
            type="number"
            name="total_orders"
            value={product.total_orders}
            onChange={handleChange}
          />
        </label>
        <label>
          Total Products Sold:
          <input
            type="number"
            name="total_products_sold"
            value={product.total_products_sold}
            onChange={handleChange}
          />
        </label>
        <label>
          Order Not Shipped:
          <input
            type="number"
            name="order_not_shipped"
            value={product.order_not_shipped}
            onChange={handleChange}
          />
        </label>
        <label>
          Order Received:
          <input
            type="number"
            name="order_received"
            value={product.order_received}
            onChange={handleChange}
          />
        </label>
        <label>
          Product Loading Status:
          <input
            type="text"
            name="product_loading_status"
            value={product.product_loading_status}
            onChange={handleChange}
          />
        </label>
        <label>
          Store Traffic:
          <input
            type="number"
            name="store_traffic"
            value={product.store_traffic}
            onChange={handleChange}
          />
        </label>
        <input type="file" onChange={handleFileUpload} />
        <button className="sub-btn" type="submit">Submit</button>
      </form>
    </>
  );
}

export default InputData;
