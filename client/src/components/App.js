import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import PaymentScreen from "./PaymentScreen";
import AddPayMethod from "./AddPayMethod";
import Register from "./Register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/add-payment-method" component={AddPayMethod} />

        <Route path="/make-payment" component={PaymentScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
