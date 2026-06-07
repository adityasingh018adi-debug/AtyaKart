import ProductsManager from "./ProductsManager";

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark">Products</h1>
      <p className="mt-1 text-sm text-dark/50">Create, edit, and remove products in the catalog.</p>
      <div className="mt-6">
        <ProductsManager />
      </div>
    </div>
  );
}
