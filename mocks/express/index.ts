#!/usr/bin/env npx ts-node

import https from "https";
import path from "path";

import compression from "compression";
import express from "express";
import selfsigned from "selfsigned";

import { createApp } from "./app";

function createCertificate() {
  return selfsigned.generate([{ name: "commonName", value: "localhost" }], {
    algorithm: "sha256",
    days: 30,
    keySize: 2048,
    extensions: [
      // {
      //   name: 'basicConstraints',
      //   cA: true,
      // },
      {
        name: "keyUsage",
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: "extKeyUsage",
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        timeStamping: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            // type 2 is DNS
            type: 2,
            value: "localhost",
          },
          {
            type: 2,
            value: "[::1]",
          },
          {
            // type 7 is IP
            type: 7,
            ip: "127.0.0.1",
          },
          {
            type: 7,
            ip: "0.0.0.0",
          },
          {
            type: 7,
            ip: "fe80::1",
          },
        ],
      },
    ],
  });
}

function createServer(port = Number(process.env.PORT) || 8080) {
  const app = express();

  app.disable("x-powered-by");

  app.use(compression());

  app.get("/health-check", (req, res) => {
    res.send(`{"status":"healthy"}`);
  });

  app.use(express.static(path.resolve(__dirname, "..", "..", "docs")));
  app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

  app.use(createApp());

  // serve the index page to any other request (to enable client-side routing)
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "..", "docs", "index.html"));
  });

  const tokens = createCertificate();
  const key = tokens.private + tokens.cert;

  return https.createServer({ key, cert: key }, app).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port: ${port}`);
  });
}

if (module === require.main) {
  createServer();
}
