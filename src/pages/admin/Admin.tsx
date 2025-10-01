import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import AdminDashboard from './AdminDashboard';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import CategoriesList from './CategoriesList';
import CategoryForm from './CategoryForm';

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Admin;
