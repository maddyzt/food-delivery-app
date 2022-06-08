function checker() {
  if(window.confirm("Are you sure you want to cancel your order?")){
    document.getElementById("cancel").submit();
  } else {
    return;
  }
};

$(() => {
  $(".cart-container").css("display", "none");

  $(".customer_order_cancel_button").on("submit", function(e) {
    e.preventDefault();
    const orderId = $(this).serialize();
    $.post("/api/menu/order/cancel", orderId)
    .then(response => {
      console.log(response);
      window.location.replace("/api/menu/order");
    })
    .catch(error => {
      console.log(error);
    });
  });

  $(".customer_order_delete_history_button").on("submit", function(e) {
    e.preventDefault();
    const orderId = $(this).serialize();
    $.post("/api/menu/order", orderId)
    .then(response => {
      console.log(response);
      window.location.replace("/api/menu/order");
    })
    .catch(error => {
      console.log(error);
    });
  });

})