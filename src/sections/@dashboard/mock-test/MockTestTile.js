import { Button, Card, CardContent, Link, Paper } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { styled } from "@mui/system";

const GradientButton0 = styled(Button)`
  background: linear-gradient(45deg, #ffa000 30%, #ffc107 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton1 = styled(Button)`
  background: linear-gradient(45deg, #6de195 30%, #c4e759 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton2 = styled(Button)`
  background: linear-gradient(45deg, #41c7af 30%, #54e38e 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton3 = styled(Button)`
  background: linear-gradient(45deg, #99e5a2 30%, #d4fc78 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton4 = styled(Button)`
  background: linear-gradient(45deg, #abc7ff 30%, #c1e3ff 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton5 = styled(Button)`
  background: linear-gradient(45deg, #6cacff 30%, #8debff 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton6 = styled(Button)`
  background: linear-gradient(45deg, #5583ee 30%, #41d8dd 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton7 = styled(Button)`
  background: linear-gradient(45deg, #deb0df 30%, #a16bfe 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton8 = styled(Button)`
  background: linear-gradient(45deg, #f8c390 30%, #d279ee 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton9 = styled(Button)`
  background: linear-gradient(45deg, #fdeb82 30%, #f78fad 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton10 = styled(Button)`
  background: linear-gradient(45deg, #a16bfe 30%, #bc3d2f 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton11 = styled(Button)`
  background: linear-gradient(45deg, #a43ab2 30%, #e13680 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton12 = styled(Button)`
  background: linear-gradient(45deg, #e16e93 30%, #9d2e7d 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton13 = styled(Button)`
  background: linear-gradient(45deg, #f1eef9 30%, #f5ccf6 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton14 = styled(Button)`
  background: linear-gradient(45deg, #faf8f9 30%, #f0eff0 90%);
  border-radius: 3px;
  border: 0;
  color: black;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

const GradientButton15 = styled(Button)`
  background: linear-gradient(45deg, #323b42 30%, #121317 90%);
  border-radius: 3px;
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 160, 0, 0.3);
`;

export default function MockTestTile({ tileValue, tileLink }) {
  const randomNumber = parseInt(Math.random() * 100) % 16;

  if (randomNumber === 0) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton0
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton0>
        }
      />
    )
  }
  if (randomNumber === 1) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton1
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton1>
        }
      />
    )
  }
  if (randomNumber === 2) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton2
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton2>
        }
      />
    )
  }
  if (randomNumber === 3) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton3
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton3>
        }
      />
    )
  }
  if (randomNumber === 4) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton4
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton4>
        }
      />
    )
  }
  if (randomNumber === 5) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton5
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton5>
        }
      />
    )
  }
  if (randomNumber === 6) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton6
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton6>
        }
      />
    )
  }
  if (randomNumber === 7) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton7
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton7>
        }
      />
    )
  }
  if (randomNumber === 8) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton8
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton8>
        }
      />
    )
  }
  if (randomNumber === 9) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton9
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton9>
        }
      />
    )
  }
  if (randomNumber === 10) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton10
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton10>
        }
      />
    )
  }
  if (randomNumber === 11) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton11
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton11>
        }
      />
    )
  }
  if (randomNumber === 12) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton12
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton12>
        }
      />
    )
  }
  if (randomNumber === 13) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton13
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton13>
        }
      />
    )
  }
  if (randomNumber === 14) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton14
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton14>
        }
      />
    )
  }
  if (randomNumber === 15) {
    return (
      <Paper
        sx={{ width: 128, height: 128 }}
        elevation={12}
        children={
          <GradientButton15
            sx={{ width: 128, height: 128 }}
            variant="contained"
            component={RouterLink}
            to={tileLink}
          >
            {tileValue}
          </GradientButton15>
        }
      />
    )
  }
}