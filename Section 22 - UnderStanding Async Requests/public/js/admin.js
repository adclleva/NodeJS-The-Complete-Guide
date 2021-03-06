// we get access to the button thanks to "this" within the html
// this allows us to send asyc requests to the server
const deleteProduct = (button) => {
  // extracting the values needed for the async delete request
  const productId = button.parentNode.querySelector("[name=productId").value;
  const csrf = button.parentNode.querySelector("[name=_csrf]").value;

  const productElement = button.closest("article");

  // can be used for sending data as well
  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    // the csurf packages also looks at the query parameters
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      console.log(result);
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => console.log(err));
};
