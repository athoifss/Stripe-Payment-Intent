import React, { useState, useEffect, useRef } from "react";
import style from "./AddPayMethod.module.scss";

import { useElements, useStripe } from "@stripe/react-stripe-js";

import { Country, State, City } from "country-state-city";
import Select from "react-select";

import { postRequest } from "../utils/api";
import { CardElement } from "@stripe/react-stripe-js";

export default function AddPayMethod() {
  const stripe = useStripe();

  const elements = useElements();
  const card = useRef();

  const [cardInfo, setCardInfo] = useState({
    name: "",
    expiry: "",
    number: "",
    address: {
      line: "",
      postalCode: "",
    },
  });

  const [locations, setLocations] = useState({ countries: "", states: "", cities: "" });
  const [selectedLocation, setSelectedLocation] = useState({ country: {}, city: {}, state: {} });

  function handleChangeAddressLine(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, address: { ...prev.address, line: value } };
    });
  }

  // function handleChangePostalCode(e) {
  //   const { value } = e.target;
  //   setCardInfo((prev) => {
  //     return { ...prev, address: { ...prev.address, postalCode: value } };
  //   });
  // }

  function handleChangeName(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, name: value };
    });
  }

  function parseForSelect(arr) {
    return arr.map((item) => ({
      label: item.name,
      value: item.isoCode ? item.isoCode : item.name,
    }));
  }

  function handleSelectCountry(country) {
    const states = State.getStatesOfCountry(country.value);
    setSelectedLocation((prev) => {
      return { ...prev, country };
    });

    setLocations((prev) => ({ ...prev, states: parseForSelect(states) }));
  }

  function handleSelectState(state) {
    const cities = City.getCitiesOfState(selectedLocation.country.value, state.value);
    setSelectedLocation((prev) => {
      return { ...prev, state };
    });

    setLocations((prev) => ({ ...prev, cities: parseForSelect(cities) }));
  }

  function handleSelectCity(city) {
    setSelectedLocation((prev) => {
      return { ...prev, city };
    });
  }

  async function handleSubmit() {
    const address = cardInfo.address;
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: address.country,
        state: address.state,
        city: address.city,
        line1: address.line,
      },
    };

    try {
      stripe
        .createPaymentMethod({
          type: "card",
          billing_details: billingDetails,
          card: elements.getElement(CardElement),
        })
        .then((resp) => {
          postRequest("/payment/method/attach", { paymentMethod: resp.paymentMethod })
            .then((resp) => {
              /* Handle success */
            })
            .catch((err) => {
              /*Handle Error */
            });
          console.log(resp);
        });
    } catch (err) {
      /* Handle Error*/
    }
  }

  useEffect(() => {
    const allCountry = Country.getAllCountries();

    setLocations((prev) => {
      return { ...prev, countries: parseForSelect(allCountry) };
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.innerWrapper}>
        <div className={style.title}>Add Payment Method</div>
        <div className={style.row}>
          <label>Cardholder Name</label>
          <input
            onChange={handleChangeName}
            type="text"
            name="name"
            placeholder="Enter card holder name"
          />
        </div>
        <div className={style.rowPaymentInput}>
          <CardElement ref={card} />
        </div>

        <div className={style.addressWrapper}>
          <div className={style.row}>
            <label>Address</label>
            <input
              onChange={handleChangeAddressLine}
              type="text"
              name="address"
              placeholder="Enter Full Address"
            />
          </div>
          <div className={style.rowSelect}>
            <div>
              <label>Country</label>
              <Select
                isClearable={true}
                isSearchable={true}
                name="country"
                value={selectedLocation.country}
                options={locations.countries}
                onChange={handleSelectCountry}
              />
            </div>

            <div>
              <label>State</label>
              <Select
                isClearable={true}
                isSearchable={true}
                name="state"
                value={selectedLocation.state}
                options={locations.states}
                onChange={handleSelectState}
              />
            </div>
          </div>
          <div className={style.rowSelect}>
            <div>
              <label>City</label>
              <Select
                isClearable={true}
                isSearchable={true}
                name="city"
                value={selectedLocation.city}
                options={locations.cities}
                onChange={handleSelectCity}
              />
            </div>

            {/* <div>
              <label>Postal Code</label>
              <input onChange={handleChangePostalCode} type="text" placeholder="Enter Zip Code" />
            </div> */}
          </div>

          <div className={style.btnContainer}>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
