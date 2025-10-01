import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import AdminDashboard from './AdminDashboard';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import CategoriesList from './CategoriesList';
import CategoryForm from './CategoryForm';
import NewsList from './NewsList';
import NewsForm from './NewsForm';
import LeadsList from './LeadsList';
import DownloadsList from './DownloadsList';
import DownloadForm from './DownloadForm';

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
          <Route path="news" element={<NewsList />} />
          <Route path="news/new" element={<NewsForm />} />
          <Route path="news/:id" element={<NewsForm />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="downloads" element={<DownloadsList />} />
          <Route path="downloads/new" element={<DownloadForm />} />
          <Route path="downloads/:id" element={<DownloadForm />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Admin;
