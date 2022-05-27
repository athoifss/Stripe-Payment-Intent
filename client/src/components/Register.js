import React, { useState } from "react";
import style from "./Register.module.scss";

import { postRequest } from "../utils/api";

export default function Register() {
  const [formData, setFormData] = useState({});

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    postRequest("/user/register", formData)
      .then((resp) => {
        console.log(resp);
        alert("Customer Created");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={style.wrapper}>
      <form onChange={handleFormChange} onSubmit={handleFormSubmit}>
        <div className={style.title}>Create An Account</div>
        <div className={style.row}>
          <label>Name</label>
          <input name="name" type="text" />
        </div>
        <div className={style.row}>
          <label>Email</label>
          <input name="email" type="email" />
        </div>
        <div className={style.row}>
          <label>Password</label>
          <input name="password" type="password" />
        </div>
        <div className={style.row}>
          <label>Phone</label>
          <input name="phone" type="number" />
        </div>
        <div className={style.btnContainer}>
          <button>Create Account</button>
        </div>
      </form>
    </div>
  );
}
