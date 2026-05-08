import React, { useState, useEffect, useMemo } from 'react';
import { Scale, X, ShoppingBag, Plus } from 'lucide-react';
import { productAPI } from '../services/api';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ProductSkeleton } from '../components/ui/Skeleton';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productIds = useMemo(() => {
    return (
      searchParams
        .get('ids')
        ?.split(',')
        .filter(id => id.trim() !== '') || []
    );
  }, [searchParams]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useStore();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    let isMounted = true;

    const fetchComparisonProducts = async () => {
      try {
        setLoading(true);
        setError('');

        // if no ids in url
        if (productIds.length === 0) {
          if (isMounted) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        // fetch all selected products
        const responses = await Promise.all(
          productIds.map(id => productAPI.getProduct(id))
        );

        const fetchedProducts = responses
          .map(res => res?.data?.data || res?.data)
          .filter(product => product && product._id);

        if (isMounted) {
          setProducts(fetchedProducts);

          if (fetchedProducts.length === 0) {
            setError('No products found.');
          }
        }
      } catch (err) {
        console.error('Comparison fetch error:', err);

        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              'Failed to load comparison products.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchComparisonProducts();

    return () => {
      isMounted = false;
    };
  }, [searchParams.toString()]);

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'info');
      navigate('/auth');
      return;
    }

    addToCart(product, 1, 'M');
    showNotification(`Added ${product.name} to your cart`, 'success');
  };

  const removeProduct = (id) => {
    const updatedIds = productIds.filter(pid => pid !== id);

    if (updatedIds.length === 0) {
      navigate('/comparison');
    } else {
      navigate(`/comparison?ids=${updatedIds.join(',')}`);
    }
  };

  const specs = [
    {
      label: 'Price',
      getValue: p => `$${p.price?.toLocaleString() || '—'}`
    },
    {
      label: 'Category',
      getValue: p => p.category || '—'
    },
    {
      label: 'Rating',
      getValue: p => `${p.rating || 0} / 5`
    },
    {
      label: 'Stock',
      getValue: p =>
        p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'
    },
    {
      label: 'Brand',
      getValue: p => p.brand || '—'
    },
    {
      label: 'Material',
      getValue: p => p.material || '—'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe mb-6">
          <Scale size={32} />
        </div>

        <h2 className="text-2xl font-display mb-4">
          Comparison Unavailable
        </h2>

        <p className="text-text-luxe/60 mb-8">{error}</p>

        <Link
          to="/products"
          className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#6F472C] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe mb-6">
          <Scale size={32} />
        </div>

        <h2 className="text-2xl font-display mb-4">
          No products selected
        </h2>

        <p className="text-text-luxe/60 mb-8">
          Select products from the products page to compare them.
        </p>

        <Link
          to="/products"
          className="inline-block px-8 py-4 bg-[#8B5E3C] text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#6F472C] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="space-y-12 md:space-y-20">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-layer-luxe rounded-3xl text-primary-luxe">
            <Scale size={32} />
          </div>

          <h1 className="text-4xl md:text-5xl font-display">
            Product <span className="italic text-[#8B5E3C]">Comparison</span>
          </h1>

          <p className="text-text-luxe/60 max-w-md mx-auto text-sm md:text-base">
            Compare up to 3 products side by side.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-6">
          <div className="min-w-[800px]">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b border-border-luxe/20">

                  <th className="py-6 md:py-10 w-1/4 text-left align-top">
                    <Link
                      to="/products"
                      className="inline-flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary-luxe hover:text-[#6F472C]"
                    >
                      <Plus size={14} />
                      <span>Add product</span>
                    </Link>
                  </th>

                  {products.map(product => (
                    <th
                      key={product._id}
                      className="py-6 md:py-10 px-4 md:px-6 text-left relative group"
                    >
                      <button
                        onClick={() => removeProduct(product._id)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-red-500" />
                      </button>

                      <div className="space-y-4">

                        <Link to={`/product/${product._id}`}>
                          <div className="aspect-square rounded-2xl overflow-hidden bg-layer-luxe">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </Link>

                        <div>
                          <h3 className="text-sm md:text-lg font-medium line-clamp-2">
                            {product.name}
                          </h3>

                          <p className="text-[#8B5E3C] font-bold">
                            ${product.price?.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">

                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-3 bg-[#8B5E3C] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#6F472C]"
                          >
                            Add to Cart
                          </button>

                          <Link
                            to={`/product/${product._id}`}
                            className="w-full py-3 border border-border-luxe rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-layer-luxe"
                          >
                            View Details
                          </Link>

                        </div>

                      </div>
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody className="divide-y divide-border-luxe/10">

                {specs.map((spec, index) => (
                  <tr
                    key={index}
                    className="hover:bg-layer-luxe/10 transition-colors"
                  >
                    <td className="py-4 md:py-6 text-xs font-bold uppercase tracking-[0.3em] text-border-luxe">
                      {spec.label}
                    </td>

                    {products.map(product => (
                      <td
                        key={product._id}
                        className="py-4 md:py-6 px-4 md:px-6 text-sm"
                      >
                        {spec.getValue(product)}
                      </td>
                    ))}
                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;