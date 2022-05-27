import React, { useEffect, useState } from "react";
import style from "./ListPaymentMethods.module.scss";

import { format } from "date-fns";
import { getRequest } from "../utils/api";
import { getCardImage } from "../utils/helpers";

export default function ListPaymentMethods({ handleSelectCard }) {
  const [paymentMethods, setPaymentMethods] = useState(null);

  function getPaymentMethods() {
    getRequest(`/payment/methods`)
      .then((resp) => {
        console.log(resp.data.data);
        setPaymentMethods(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(getPaymentMethods, []);

  return (
    <div className={style.wrapper}>
      <h3>Select your preferred payment method</h3>
      {paymentMethods &&
        paymentMethods.map((method) => (
          <div className={style.card} onClick={handleSelectCard.bind(this, method)}>
            <div className={style.cardLogo}>
              <img src={getCardImage(method.card.brand)} alt="" />
            </div>

            <div className={style.details}>
              <p>
                {method.card.brand} **** {method.card.last4}
              </p>
              <p>{method.billing_details.name}</p>
            </div>

            <div className={style.expire}>
              Expires{" "}
              {format(new Date(`${method.card.exp_year}/${method.card.exp_month}/01`), "MM/yyyy")}
            </div>
          </div>
        ))}
    </div>
  );
}
