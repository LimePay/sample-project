This is a sample project containing UI + Backend logic needed for integraiton with LimePay

The UI can be accessed at `/static`

In order for you to check the HTML example:
`/static/limepay-in-html.html`

In order for you to check the module example:
`/static/limepay-as-module.html`

Once loaded, an request will be made to the backend (`GET` request to `localhost:9090/`) in order for the LimePay token to be requested.
Once the limepay token is recieved, the LimePay checkout is Initialized.
