import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Badge,
  Chip,
} from "@mui/material";
import { manu } from "./manuSeed";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  increment,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// const seedManu = () => {
//   try {
//     manu.forEach(async (m) => {
//       const docRef = doc(db, "manufacturers", m.name.split(" ").join('')); // You might want to replace m.name with a unique ID
//       //await setDoc(docRef, m); // Pass the entire manufacturer object
//       console.log(`Document added with id: ${docRef.id}`);
//       m.productsSold.map(async (p) => {
//         const pDocRef = doc(db, "products", p);
//         await setDoc(pDocRef, {
//           category: [],
//           pricePer: null,
//           quantity: 0,
//           avgCost: 0,
//           totalValue: 0
//         })
//         const batchesSubcollectionRef = collection(db, "products", p, "batches");

//         const orderQty = Math.ceil((Math.random() + 1) * 10);
//         const costPerItem = Math.random().toFixed(2);

//         await addDoc(batchesSubcollectionRef, {
//           harvestDate: new Date().getTime(),
//           expiryDate: new Date().setUTCFullYear(new Date().getUTCFullYear() + 1),
//           orderQuantity: orderQty,
//           costPerItem: costPerItem,
//           manufacturer: docRef.id
//         })

//         await updateDoc(pDocRef, {
//           quantity: increment(orderQty),
//           totalValue: increment(costPerItem * orderQty)
//         })

//         await runTransaction(db, async (transaction) => {
//           const productSnap = await transaction.get(pDocRef);

//           if (!productSnap.exists()) {
//             console.log('DOES NOT EXIST');
//             return;
//           }

//           const currQty = productSnap.data().quantity;
//           const currValue = productSnap.data().totalValue;

//           const newAvgCost = currValue / currQty

//           const newPricePer = ((newAvgCost * 0.8) + newAvgCost)

//           transaction.update(pDocRef, { avgCost: newAvgCost, pricePer: newPricePer });
//         })
//       })
//     });
//   } catch (err) {
//     console.log("ERR", err);
//   }
// };

const getProducts = async () => {
  const productsRef = collection(db, "products");
  const productsSnap = await getDocs(productsRef);

  const products = productsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products;
};


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  //seedManu();
  useEffect(() => {
    const fetchProducts = async () => {
      const prods = await getProducts();
      setProducts(prods);
      setRows(prods);
    };
    fetchProducts();
  }, []);

  const columns = [
    { field: "id", headerName: "Product", width: 150 },
    {
      field: "pricePer",
      headerName: "Price Per",
      flex: 1,
      valueFormatter: ({ value }) => "$" + value.toFixed(2),
    },
    {
      field: "avgCost",
      headerName: "Average Cost",
      flex: 1,
      valueFormatter: ({ value }) => "$" + value.toFixed(2),
    },
    { field: "quantity", headerName: "Quantity", width: 150 },
    {
      field: "totalValue",
      headerName: "Purchased Value",
      flex: 1,
      valueFormatter: ({ value }) => "$" + value.toFixed(2),
    },
    {
      field: "sellValue",
      headerName: "Selling Value",
      flex: 1,
      valueGetter: ({ row }) => {
        if (!row.pricePer || !row.quantity) {
          return null;
        }

        return "$" + (row.pricePer * row.quantity).toFixed(2);
      },
    },
    {
      field: "expectedProfit",
      headerName: "Expected Profit",
      flex: 1,
      valueGetter: ({ row }) => {
        if (!row.pricePer || !row.totalValue) {
          return null;
        }

        return (row.pricePer * row.quantity - row.totalValue).toFixed(2);
      },
      renderCell: (params) => {
        return (
          <Chip
            icon={<AttachMoneyIcon />}
            color={params.value > 0 ? "money" : "error"}
            label={"$" + params.value}
          ></Chip>
        );
      },
    },
  ];

  const handleRowClick = (param, event) => {
    navigate(`/editproduct/${param.row.id}`);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
    </div>
  );
};

export default Dashboard;
