// we get access to the button thanks to "this" within the html
// this allows us to send asyc requests to the server
const deleteProduct = (button) => {
  const productId = button.parentNode.querySelector("[name=productId").value;
  const csrf = button.parentNode.querySelector("[name=_csrf]").value;
};
