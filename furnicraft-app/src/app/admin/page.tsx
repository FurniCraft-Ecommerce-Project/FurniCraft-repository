"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { ProductType } from "@/type";
// import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebouncedCallback } from "use-debounce";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "@/components/Navbar";
import Button3DModel from "@/components/Button3DModel";

export default function AdminPage() {
  // State untuk produk dan loading
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk paginasi dan pencarian
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [name, setName] = useState("");

  // State untuk modal form
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  // State untuk form input
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    description: "",
    price: 0,
    thumbnail: "",
    stock: 0,
    category: "",
  });

  // State untuk upload file
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch produk dengan pagination
  const fetchProducts = async () => {
    try {
      // Gunakan query parameter name dan page untuk pencarian dan pagination
      const response = await fetch(`/api/products?page=${page}&name=${name}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Jika page 1, reset products, jika tidak tambahkan ke array yang ada
      if (page === 1) {
        setProducts(data);

        // SOLUSI: Set hasMore ke false jika pencarian aktif dan hasilnya terbatas
        // Asumsi jika pencarian menghasilkan 1 item atau kurang dari limit pagination
        // Limit pagination biasanya 10 item per halaman
        if (name && data.length <= 1) {
          setHasMore(false);
        }
      } else {
        setProducts((prev) => [...prev, ...data]);
      }

      // Jika data kosong, tidak ada lagi yang bisa dimuat
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk pencarian dengan debounce
  const handleSearch = useDebouncedCallback(
    (term: ChangeEvent<HTMLInputElement>) => {
      const valSearch = term.target.value;

      setName(valSearch);
      // Reset products dan page ketika search dilakukan
      setProducts([]);

      // Jika pencarian kosong, atur hasMore ke true
      if (valSearch === "") {
        setHasMore(true);
      }

      setPage(1); // Trigger useEffect
    },
    600
  );

  // Efek saat page atau name berubah
  useEffect(() => {
    fetchProducts();
  }, [page, name]);

  // Handler untuk input form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  // Handler untuk upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Tipe file tidak valid. Hanya JPEG, PNG, WebP, dan GIF yang diperbolehkan."
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Ukuran file terlalu besar. Maksimum 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const data = await response.json();

      // Update form data with the uploaded image URL
      setFormData((prev) => ({
        ...prev,
        thumbnail: data.url,
      }));

      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle thumbnail removal
  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: "",
    }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler untuk membuka modal tambah produk
  const handleAddClick = () => {
    setFormData({
      productId: "",
      name: "",
      description: "",
      price: 0,
      thumbnail: "",
      stock: 0,
      category: "",
    });
    setModalMode("add");
    setShowModal(true);
  };

  // Handler untuk membuka modal edit produk
  const handleEditClick = (product: ProductType) => {
    setFormData({
      productId: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      stock: product.stock,
      category: product.category,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi URL tidak lagi diperlukan karena kita mendapatkan URL dari Cloudinary
    if (!formData.thumbnail) {
      toast.error("Harap unggah gambar produk terlebih dahulu.");
      return;
    }

    try {
      let url = "/api/admin/products";
      let method = modalMode === "add" ? "POST" : "PUT";

      // Jika mode add, hapus productId dari data
      const submitData =
        modalMode === "add"
          ? {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              thumbnail: formData.thumbnail,
              stock: formData.stock,
              category: formData.category,
            }
          : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${modalMode === "add" ? "add" : "update"} product`
        );
      }

      toast.success(
        `Produk berhasil ${modalMode === "add" ? "ditambahkan" : "diperbarui"}`
      );
      setShowModal(false);

      // Reset state setelah submit berhasil
      setProducts([]);
      setPage(1);
      setHasMore(true);
      fetchProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        `Gagal ${modalMode === "add" ? "menambahkan" : "memperbarui"} produk`
      );
    }
  };

  // Handler untuk hapus produk
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Produk berhasil dihapus");

      // Reset state setelah delete berhasil
      setProducts([]);
      setPage(1);
      setHasMore(true);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Gagal menghapus produk");
    }
  };

  // Format currency untuk tampilan harga
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white">
        <ToastContainer position="top-right" autoClose={3000} />{" "}
        {/* Header Admin */}
        <header className="bg-[#F8F8F8] py-4 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#D4A86A] rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  FurniCraft Admin
                </h1>
              </div>

              {/* Menu navigasi admin */}
              <div className="flex space-x-3">
                <a
                  href="/admin"
                  className="bg-[#D4A86A] hover:bg-[#C19556] text-white px-4 py-2 rounded-md font-medium transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  Produk
                </a>
                <a
                  href="/admin/order"
                  className="bg-white border border-[#D4A86A] text-[#D4A86A] hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-all flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                    />
                  </svg>
                  Pesanan
                </a>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search Box */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <fieldset className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="pl-10 p-3 w-full border-none focus:ring-0 focus:outline-none text-sm"
                    placeholder="Cari produk berdasarkan nama..."
                    onChange={handleSearch}
                  />
                </div>
              </fieldset>
            </div>
          </div>

          {/* Loading State */}
          {loading && page === 1 ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#D4A86A] border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Memuat produk...</p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={products.length}
              next={() => setPage(page + 1)}
              hasMore={hasMore}
              loader={
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-[#D4A86A] border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Memuat produk lainnya...
                  </p>
                </div>
              }
              endMessage={
                <p className="text-center py-4 text-sm text-gray-500">
                  {products.length > 0 ? "Semua produk telah ditampilkan" : ""}
                </p>
              }
              scrollThreshold={0.9}
            >
              {" "}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Manajemen Produk {name && `- Hasil pencarian "${name}"`}
                    </h2>
                    <button
                      onClick={handleAddClick}
                      style={{ cursor: "pointer" }}
                      className="bg-[#D4A86A] hover:bg-[#C19556] text-white px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Tambah Produk
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produk
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            {name
                              ? `Tidak ada produk dengan nama "${name}"`
                              : "Tidak ada produk yang tersedia"}
                          </td>
                        </tr>
                      ) : (
                        products.map((product, index) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-14 w-14">
                                  <img
                                    src={
                                      product.thumbnail || "/placeholder.png"
                                    }
                                    alt={product.name}
                                    className="h-14 w-14 rounded-md object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror =
                                        null;
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder.png";
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(product.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                style={{ cursor: "pointer" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900 mr-4"
                                style={{ cursor: "pointer" }}
                              >
                                Hapus
                              </button>
                              {!product.image3dUrl && (
                                <Button3DModel
                                  imageUrl={product.thumbnail}
                                  id={product._id}
                                  text="Generate"
                                />
                                // <button
                                //   onClick={() => handleDelete(product._id)}
                                //   className="btn text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 rounded-md px-3 py-1 text-sm font-medium"
                                //   style={{ cursor: "pointer" }}
                                // >
                                //   Generate 3D Model
                                // </button>
                              )}
                              {product.image3dUrl && (
                                <Button3DModel
                                  imageUrl={product.thumbnail}
                                  id={product._id}
                                  text="See"
                                />
                                // <button
                                //   onClick={() => handleDelete(product._id)}
                                //   className="btn text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 rounded-md px-3 py-1 text-sm font-medium"
                                //   style={{ cursor: "pointer" }}
                                // >
                                //   Generate 3D Model
                                // </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </InfiniteScroll>
          )}
        </main>
        {/* Modal Form untuk Add/Edit Produk */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {modalMode === "add" ? "Tambah Produk Baru" : "Edit Produk"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                      placeholder="Masukkan nama produk"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                      placeholder="Deskripsi produk"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Harga (IDR)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                      placeholder="Harga dalam Rupiah"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Stok
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                      placeholder="Jumlah stok"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Kategori
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="chair">Kursi</option>
                      <option value="sofa">Sofa</option>
                      <option value="table">Meja</option>
                      <option value="bed">Tempat Tidur</option>
                      <option value="cabinet">Kabinet/Lemari</option>
                      <option value="desk">Meja Kerja</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gambar Produk
                    </label>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="file"
                        id="thumbnail"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A86A]"
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#D4A86A] border-t-transparent"></div>
                          <span className="text-sm text-gray-500">
                            Mengunggah gambar...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.thumbnail && (
                    <div className="col-span-2 flex flex-col items-center space-y-2">
                      <div className="w-40 h-40">
                        <img
                          src={formData.thumbnail}
                          alt="Preview"
                          className="rounded-md object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                              "/placeholder.png";
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D4A86A] hover:bg-[#C19556] text-white rounded-md text-sm font-medium"
                  >
                    {modalMode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
