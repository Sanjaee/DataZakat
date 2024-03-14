import "../Styles/DasbordZakat.css";

export const DasbordZakat = (props) => {
  const { children } = props;
  return (
    <div className="container">
      <img src="2.jpg" alt="" />
      <div>{children}</div>
      <img className="footer_img" src="3.jpg" alt="" />
    </div>
  );
};
