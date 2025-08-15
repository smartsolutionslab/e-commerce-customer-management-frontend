const ModuleFederationPlugin = require("@angular-architects/module-federation/webpack");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "customer-mf",
      filename: "remoteEntry.js",
      exposes: {
        "./Module": "./src/app/customer/customer.module.ts"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@ngrx/store": { singleton: true, strictVersion: true },
        "@e-commerce/common-auth": { singleton: true, strictVersion: true },
        "@e-commerce/common-ui": { singleton: true, strictVersion: true }
      }
    })
  ]
};
