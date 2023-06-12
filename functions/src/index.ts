import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import axios from "axios";

const api = express();
api.use(cors({origin: true}));

/* eslint-disable max-len */

api.post("/api/token", (request, response) => {
  const headers = {
    "Content-Type": "application/json",
    "Tbk-Api-Key-Id": "597055555532",
    "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
  };

  const url = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions";

  const datosDeCompra = {
    "buy_order": "ordenCompra12345678",
    "session_id": "sesion1234557545",
    "amount": 10000,
    "return_url": "https://www.mydominio.cl/",
  };

  axios
    .post(url, datosDeCompra, {headers: headers})
    .then((r) => {
      console.log("data => ", r.data);
      return response.send(r.data);
    })
    .catch((e) => {
      console.log("error =>", e.response.data);
      return response.send(e.response.data);
    });
});

export const app = functions.https.onRequest(api);
