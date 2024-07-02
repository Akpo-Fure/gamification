export const OverflowWrapper = ({ children, minWidth }) => {
  return (
    <div
      style={{
        overflowX: "auto",
        width: "auto",
      }}
    >
      <div
        style={{
          minWidth: minWidth || "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
