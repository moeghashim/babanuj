analytics.subscribe("checkout_started", function (event) {
  var checkout = event.data && event.data.checkout;
  var lines = checkout && checkout.lineItems ? checkout.lineItems : [];
  var contents = [];
  var ids = [];
  var quantity = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var variant = line.variant || {};
    var product = variant.product || {};
    var id = product.id || variant.id || line.id;
    var lineQuantity = line.quantity || 1;
    var finalAmount = line.finalLinePrice && line.finalLinePrice.amount;
    var unitPrice = finalAmount
      ? Number(finalAmount) / lineQuantity
      : Number((variant.price && variant.price.amount) || 0);

    if (id) {
      ids.push(String(id));
      contents.push({
        id: String(id),
        quantity: lineQuantity,
        item_price: unitPrice,
      });
    }
    quantity += lineQuantity;
  }

  fetch("https://www.babanuj.com/api/meta/capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      eventName: "InitiateCheckout",
      eventId: "shopify_ic." + (event.id || Date.now()),
      eventSourceUrl:
        event.context &&
        event.context.document &&
        event.context.document.location &&
        event.context.document.location.href,
      payload: {
        content_ids: ids,
        content_type: "product",
        contents: contents,
        currency: (checkout && checkout.currencyCode) || "USD",
        num_items: quantity,
        value: Number(
          (checkout && checkout.totalPrice && checkout.totalPrice.amount) || 0,
        ),
      },
      userData: {
        email: checkout && checkout.email,
        phone: checkout && checkout.phone,
      },
    }),
  });
});

analytics.subscribe("payment_info_submitted", function (event) {
  var checkout = event.data && event.data.checkout;

  fetch("https://www.babanuj.com/api/meta/capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      eventName: "AddPaymentInfo",
      eventId: "shopify_api." + (event.id || Date.now()),
      eventSourceUrl:
        event.context &&
        event.context.document &&
        event.context.document.location &&
        event.context.document.location.href,
      payload: {
        currency: (checkout && checkout.currencyCode) || "USD",
        value: Number(
          (checkout && checkout.totalPrice && checkout.totalPrice.amount) || 0,
        ),
      },
      userData: {
        email: checkout && checkout.email,
        phone: checkout && checkout.phone,
      },
    }),
  });
});

analytics.subscribe("checkout_completed", function (event) {
  var checkout = event.data && event.data.checkout;
  var billing =
    checkout && checkout.billingAddress ? checkout.billingAddress : {};
  var shipping =
    checkout && checkout.shippingAddress ? checkout.shippingAddress : {};
  var address =
    billing.firstName || billing.lastName || billing.zip ? billing : shipping;
  var lines = checkout && checkout.lineItems ? checkout.lineItems : [];
  var contents = [];
  var ids = [];
  var quantity = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var variant = line.variant || {};
    var product = variant.product || {};
    var id = product.id || variant.id || line.id;
    var lineQuantity = line.quantity || 1;
    var finalAmount = line.finalLinePrice && line.finalLinePrice.amount;
    var unitPrice = finalAmount
      ? Number(finalAmount) / lineQuantity
      : Number((variant.price && variant.price.amount) || 0);

    if (id) {
      ids.push(String(id));
      contents.push({
        id: String(id),
        quantity: lineQuantity,
        item_price: unitPrice,
      });
    }
    quantity += lineQuantity;
  }

  fetch("https://www.babanuj.com/api/meta/capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      eventName: "Purchase",
      eventId: "shopify_purchase." + (event.id || Date.now()),
      eventSourceUrl:
        event.context &&
        event.context.document &&
        event.context.document.location &&
        event.context.document.location.href,
      payload: {
        content_ids: ids,
        content_type: "product",
        contents: contents,
        currency: (checkout && checkout.currencyCode) || "USD",
        num_items: quantity,
        value: Number(
          (checkout && checkout.totalPrice && checkout.totalPrice.amount) || 0,
        ),
        order_id: checkout && checkout.order && checkout.order.id,
      },
      userData: {
        email: checkout && checkout.email,
        phone: (checkout && checkout.phone) || address.phone,
        firstName: address.firstName,
        lastName: address.lastName,
        city: address.city,
        state: address.provinceCode || address.province,
        zip: address.zip,
        country: address.countryCode || address.country,
      },
    }),
  });
});
