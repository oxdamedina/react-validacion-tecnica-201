const Product = ({ product }) => (
  <article
    style={{
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "16px",
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px",
      maxWidth: "400px"
    }}
  >
    <h3 style={{ margin: 0, textTransform: "capitalize" }}>
      {product.name}
    </h3>

    <span
      style={{ fontWeight: "bold", color: "#2563eb" }}
    >
      {product.price.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR"
      })}
    </span>
  </article>
);

export default Product