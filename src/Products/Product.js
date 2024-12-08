import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Switch, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [editproduct, setEditProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openEditPopup, setEditOpenPopup] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/delete/${id}`, {
          method: 'delete',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete product');
        fetchProducts();
        alert(`Deleted product with ID: ${id}`);
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };
  
  const handleEdit = async (id) => {
   console.log(id,"id")
  
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/getbyid/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        console.log(data.data,"edit");
        setEditProduct(data.data);
       
      } catch (error) {
        console.log('Error fetching product: ' + error.message);
      }
    
  };
  const handleisRecommendedToggle = async (id, currentValue) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update_isRecommended/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRecommended: !currentValue }),
      });
  
      if (!response.ok) throw new Error('Failed to update isRecommended');
      
      // Optimistic UI Update
    fetchProducts()
      
      alert('isRecommended updated successfully');
    } catch (error) {
      alert('Error updating isRecommended: ' + error.message);
    }
  };
  const handleIsBestsellerToggle = async (id, currentValue) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update_isBestseller/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBestseller: !currentValue }),
      });
  
      if (!response.ok) throw new Error('Failed to update IsBestseller');
      
     fetchProducts()
  
      alert('IsBestseller updated successfully');
    } catch (error) {
      alert('Error updating IsBestseller: ' + error.message);
    }
  };
  
  const handleStatusToggle = async (id, currentValue) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update_status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !currentValue }),
      });
  
      if (!response.ok) throw new Error('Failed to update status');
      
    fetchProducts()
  
      alert('Status updated successfully');
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };
  

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be a positive number'),
      description: Yup.string()
        .required('Description is required')
        .max(200, 'Description must be 200 characters or less'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error('Failed to add product');
        fetchProducts();
        setOpenPopup(false);
        resetForm();
        alert('Product added successfully');
      } catch (error) {
        alert('Error adding product: ' + error.message);
      }
    },
  });
  
  const editformik = useFormik({
    enableReinitialize: true, // Reinitialize form when editproduct changes
  initialValues: {
    name: editproduct?.name || '',
    price: editproduct?.price || '',
    description: editproduct?.description || '',
  },

    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be a positive number'),
      description: Yup.string()
        .required('Description is required')
        .max(200, 'Description must be 200 characters or less'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update/${editproduct._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error('Failed to update product');
        fetchProducts();
        setEditOpenPopup(false);
       
        alert('Product updated successfully');
      } catch (error) {
        alert('Error updating product: ' + error.message);
      }
    },
  });

  // Define the columns for the Data Table
  const columns = [
   
    {
      name: 'TITLE',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'SELLING PRICE',
      selector: (row) => `$${row.price}`,
      sortable: true,
    },
    {
      name: 'RECOMMENDED',
      selector: (row) => (
        <Switch
          checked={row.isRecommended }
         onChange={() => handleisRecommendedToggle(row._id,row.isRecommended)}
          color="primary"
        />
      ),
      sortable: false,
    },
    {
      name: 'BEST SELLER',
      selector: (row) => (
        <Switch
          checked={row.isBestseller}
          onChange={() => handleIsBestsellerToggle(row._id, row.IsBestseller)}
          color="primary"
        />
      ),
      sortable: false,
    },
    {
      name: 'ACTIONS',
      cell: (row) => (
        <div style={styles.actionButtons}>
          <FaEdit
          onClick={() =>  {handleEdit(row._id); setEditOpenPopup(true)}}
         
            style={styles.editIcon}
            title="Edit"
          />
          <FaTrash
            onClick={() => handleDelete(row._id)}
            style={styles.deleteIcon}
            title="Delete"
          />
          <Switch
            checked={row.status}
            onChange={() => handleStatusToggle(row._id, row.status)}
            color="primary"
           
          />
        </div>
      ),
      sortable: false,
    }
   
  ];

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <DataTable
        columns={columns}
        data={products}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div style={styles.header}>
            <button onClick={() => setOpenPopup(true)} style={styles.addButton}>
              Add Product
            </button>
          </div>
        }
      />

      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <div style={styles.field}>
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <p style={styles.error}>{formik.errors.name}</p>
              ) : null}
            </div>

            <div style={styles.field}>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
              />
              {formik.touched.price && formik.errors.price ? (
                <p style={styles.error}>{formik.errors.price}</p>
              ) : null}
            </div>

            <div style={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description ? (
                <p style={styles.error}>{formik.errors.description}</p>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPopup(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openEditPopup} onClose={() => setEditOpenPopup(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <form onSubmit={editformik.handleSubmit}>
          <DialogContent>
            <div style={styles.field}>
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={editformik.handleChange}
                onBlur={editformik.handleBlur}
                value={editformik.values.name}
              />
              {editformik.touched.name && editformik.errors.name ? (
                <p style={styles.error}>{editformik.errors.name}</p>
              ) : null}
            </div>

            <div style={styles.field}>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                onChange={editformik.handleChange}
                onBlur={editformik.handleBlur}
                value={editformik.values.price}
              />
              {editformik.touched.price && editformik.errors.price ? (
                <p style={styles.error}>{editformik.errors.price}</p>
              ) : null}
            </div>

            <div style={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                onChange={editformik.handleChange}
                onBlur={editformik.handleBlur}
                value={editformik.values.description}
              />
              {editformik.touched.description && editformik.errors.description ? (
                <p style={styles.error}>{editformik.errors.description}</p>
              ) : null}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenPopup(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' },
  addButton: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' },
  field: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
  error: { color: 'red', fontSize: '12px' },
  actionButtons: { display: 'flex', gap: '15px' },
  editIcon: { color: '#2196F3', cursor: 'pointer' },
  deleteIcon: { color: 'grey', cursor: 'pointer' },
};

export default Product;
