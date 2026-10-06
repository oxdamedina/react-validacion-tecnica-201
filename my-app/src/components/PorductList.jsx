import Product from './Product';

const PorductList = ({ products }) => (
  <div style={{ display: 'grid', gap: '16px' }}>
    {products.map((product) => (
      <Product key={product.name} product={product} />
    ))}
  </div>
);

export default PorductList