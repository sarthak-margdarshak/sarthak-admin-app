/**
 * Written By - Ritesh Ranjan
 * Website - https://sagittariusk2.github.io/
 *
 *  /|||||\    /|||||\   |||||||\   |||||||||  |||   |||   /|||||\   ||| ///
 * |||        |||   |||  |||   |||     |||     |||   |||  |||   |||  |||///
 *  \|||||\   |||||||||  |||||||/      |||     |||||||||  |||||||||  |||||
 *       |||  |||   |||  |||  \\\      |||     |||   |||  |||   |||  |||\\\
 *  \|||||/   |||   |||  |||   \\\     |||     |||   |||  |||   |||  ||| \\\
 *
 */

// IMPORT ---------------------------------------------------------------

import { useState } from "react";
import { m } from "framer-motion";
// @mui
import { Typography, TextField, Stack, Alert, AlertTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { MotionViewport, varFade } from "../../components/animate";
// Appwrite
import { APPWRITE_API } from "../../config-global";
import { Client, Functions } from "appwrite";

// ----------------------------------------------------------------------

const client = new Client()
  .setEndpoint(APPWRITE_API.backendUrl)
  .setProject(APPWRITE_API.projectId);

const functions = new Functions(client);

// ----------------------------------------------------------------------

export default function ContactForm({ title }) {
  const [name, setName] = useState();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState();
  const [message, setMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    active: false,
    type: "error",
    message: "Message",
  });

  const submitData = async () => {
    setIsLoading(true);
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(validRegex)) {
      setResult({
        active: true,
        type: "error",
        message: "Invalid Email. Please type correct email ID.",
      });
      setIsLoading(false);
      return true;
    }
    try {
      await functions.createExecution(
        APPWRITE_API.functions.contactInstitute,
        JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
        true
      );
      setIsLoading(false);
      setResult({
        active: true,
        type: "success",
        message: "We have received your message. We will soon contact you.",
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setResult({
        active: true,
        type: "error",
        message: error,
      });
    }
  };

  return (
    <Stack component={MotionViewport} spacing={5}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h3">{title}</Typography>
      </m.div>

      <Stack spacing={3}>
        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Name"
            onChange={(event) => {
              setName(event.target.value);
              setResult({
                active: false,
                type: "error",
                message: "Message",
              });
            }}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Email"
            onChange={(event) => {
              setEmail(event.target.value);
              setResult({
                active: false,
                type: "error",
                message: "Message",
              });
            }}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Subject"
            onChange={(event) => {
              setSubject(event.target.value);
              setResult({
                active: false,
                type: "error",
                message: "Message",
              });
            }}
          />
        </m.div>

        <m.div variants={varFade().inUp}>
          <TextField
            fullWidth
            label="Enter your message here."
            multiline
            rows={4}
            onChange={(event) => {
              setMessage(event.target.value);
              setResult({
                active: false,
                type: "error",
                message: "Message",
              });
            }}
          />
        </m.div>

        {result?.active && (
          <Alert
            key={result.message}
            severity={result?.type}
            onClose={() => {
              setResult({
                active: false,
                type: "error",
                message: "Message",
              });
            }}
          >
            <AlertTitle sx={{ textTransform: "capitalize" }}>
              {" "}
              {result?.type}{" "}
            </AlertTitle>
            <strong>{result?.message}</strong>
          </Alert>
        )}
      </Stack>

      <m.div variants={varFade().inUp}>
        <LoadingButton
          size="large"
          variant="contained"
          onClick={submitData}
          loading={isLoading}
        >
          Submit Now
        </LoadingButton>
      </m.div>
    </Stack>
  );
}
