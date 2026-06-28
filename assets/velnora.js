// Velnora Pets — Main JS

// FAQ accordion
function toggleFaq(el) {
  el.classList.toggle('open');
}

// Toast notification
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// Cart AJAX — update badge count on add-to-cart
document.addEventListener('DOMContentLoaded', function () {
  // Update cart count from Shopify
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      var badge = document.getElementById('cart-count');
      if (badge) badge.textContent = cart.item_count;
    });

  // Intercept add-to-cart forms for AJAX
  document.querySelectorAll('form[action="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch('/cart/add.js', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (item) {
          showToast(item.product_title + ' added to cart');
          return fetch('/cart.js');
        })
        .then(function (r) { return r.json(); })
        .then(function (cart) {
          var badge = document.getElementById('cart-count');
          if (badge) badge.textContent = cart.item_count;
        })
        .catch(function () {
          showToast('Something went wrong. Please try again.');
        });
    });
  });
});
