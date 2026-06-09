# Operational Scripts

This folder contains scripts used for external operational setup.

## `meta-shopify-checkout-pixel.js`

Custom Shopify Customer Events pixel for checkout-side Meta Conversions API
events. Shopify runs checkout on its hosted domain, so this script must be
pasted into Shopify Admin -> Settings -> Customer events and connected there.

It sends checkout events to `https://www.babanuj.com/api/meta/capi`.
