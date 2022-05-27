import React, { useState, useEffect } from "react";
import style from "./AddPayMethod.module.scss";
import { css } from "styled-components";

import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

import { Country, State, City } from "country-state-city";
import Select from "react-select";

import { postRequest } from "../utils/api";

export default function AddPayMethod() {
  const { wrapperProps, getCardImageProps, getCardNumberProps, getExpiryDateProps } =
    usePaymentInputs();

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

  function handleCardInput(e) {
    let data = { ...cardInfo };
    data[e.target.name] = e.target.value;
    setCardInfo(data);
  }

  function handleChangeAddressLine(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, address: { ...prev.address, line: value } };
    });
  }

  function handleChangePostalCode(e) {
    const { value } = e.target;
    setCardInfo((prev) => {
      return { ...prev, address: { ...prev.address, postalCode: value } };
    });
  }

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

  function handleSubmit() {
    const postData = {
      cardNumber: cardInfo.number,
      expMonth: parseInt(cardInfo.expiry.split("/")[0].trim()),
      expYear: parseInt("20" + cardInfo.expiry.split("/")[1].trim()), //assuming 21st century
      address: cardInfo.address,
      name: cardInfo.name,
    };

    postRequest("/payment/method/attach", postData)
      .then((resp) => {
        /* Handle success */
      })
      .catch((err) => {
        /*Handle Error */
      });
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
          <label>Card Details</label>
          <PaymentInputsWrapper
            {...wrapperProps}
            styles={{
              fieldWrapper: {
                base: css`
                  margin-bottom: 1rem;
                  width: 100%;
                `,
                focussed: css`
                  outline: none;
                  border: none;
                `,
              },
              inputWrapper: {
                errored: css`
                  border-color: #fa6161;
                `,
                focused: css`
                  outline: none;
                  border: none;
                `,
              },
              input: {
                errored: css`
                  color: #fa6161;
                `,
                cardNumber: css`
                  width: 15rem;
                `,
                expiryDate: css`
                  width: 10rem;
                `,
                cvc: css`
                  width: 5rem;
                `,
              },
              errorText: {
                base: css`
                  color: #fa6161;
                `,
              },
            }}
          >
            <svg {...getCardImageProps({ images })} />
            <input
              className={style.cardNumber}
              {...getCardNumberProps({
                name: "number",
                onChange: handleCardInput,
              })}
            />
            <input
              className={style.expiryDate}
              {...getExpiryDateProps({
                name: "expiry",
                onChange: handleCardInput,
              })}
            />
          </PaymentInputsWrapper>
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

            <div>
              <label>Postal Code</label>
              <input onChange={handleChangePostalCode} type="text" placeholder="Enter Zip Code" />
            </div>
          </div>

          <div className={style.btnContainer}>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
