import React from "react";

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import { useNavigate } from "react-router-dom";
import {
  nftCreateParcelSeries,
  nftCreateVoucherSeries,
} from "@realitychain/api";
import { useStyles } from "./series.style";

export const SeriesComponent = ({ balance }) => {
  const navigate = useNavigate();
  const style = useStyles();

  const [world_id, setWorld_id] = React.useState('');
  const [land_id, setLand_id] = React.useState('');
  const [land_size, setLand_size] = React.useState('');
  const [land_x, setLand_x] = React.useState('');
  const [land_y, setLand_y] = React.useState('');
  

  const handleChangeWorldID = (e) => {
    setWorld_id(e.target.value)
  }

  const handleChangeLandID = (e) => {
    setLand_id(e.target.value)
  }

  const handleChangeLandSize = (e) => {
    setLand_size(e.target.value)
  }

  const handleChangeLandX = (e) => {
    setLand_x(e.target.value)
  }

  const handleChangeLandY = (e) => {
    setLand_y(e.target.value)
  }

  const voucherParams = {
    token_metadata: {
      title: "Dark",
      media: "bafybeifdbvb6yzajogbe4dbn3bgxoli3sp7ol7upfmu2givpvbwufydthu",
      reference: "bafybeifvzitvju4ftwnkf7w7yakz7i5colcey223uk2ui4t5z3ss7l2od4",
      copies: 100,
      issued_at: "",
      description: null,
      media_hash: null,
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference_hash: null,
    },
    price: null,
    royalty: {
      [window.accountId]: 1000,
    },
  };

  const parcelParams = {
    parcel_metadata: {
      world_id,
      land_id,
      land_size,
      land_x,
      land_y,
    },
    ...voucherParams,
  };

  const handleCreateSeries = async () => {
    await nftCreateParcelSeries(window.parcelsContract, parcelParams);
    await nftCreateVoucherSeries(window.vouchersContract, voucherParams);
    navigate("/staking");
  };

  return (
    <Container style={{marginTop: 24, maxWidth: 888, padding: 0}}>
        <Typography variant="h4" style={{marginBottom: 24}}>CREATE SERIES</Typography>
      <Paper style={{minHeight: 972, padding: 24, marginBottom: 24}}>
        <Typography variant='subtitle1' style={{marginBottom : 4}}>World ID</Typography>
        <TextField value={world_id} onChange={handleChangeWorldID} style={{marginBottom: 24}} className={style.input} id="outlined-basic" fullWidth placeholder='World ID' />
        
        <Typography variant='subtitle1' style={{marginBottom : 4}}>Land ID</Typography>
        <TextField value={land_id} onChange={handleChangeLandID} style={{marginBottom: 24}} className={style.input} id="outlined-basic" fullWidth placeholder='Land ID' />

        <Typography variant='subtitle1' style={{marginBottom : 4}}>Land Size</Typography>
        <TextField type="number" value={land_size} onChange={handleChangeLandSize} style={{marginBottom: 24}} className={style.input} id="outlined-basic" fullWidth placeholder='Land size' />

        <Typography variant='subtitle1' style={{marginBottom : 4}}>Land X</Typography>
        <TextField type="number" value={land_x} onChange={handleChangeLandX} style={{marginBottom: 24}} className={style.input} id="outlined-basic" fullWidth placeholder='land x' />

        <Typography variant='subtitle1' style={{marginBottom : 4}}>Land Y</Typography>
        <TextField type="number" value={land_y} onChange={handleChangeLandY} style={{marginBottom: 24}} className={style.input} id="outlined-basic" fullWidth placeholder='land y' />

        <Button onClick={handleCreateSeries} variant="contained" color="primary" style={{width: 'auto'}}>CREATE SERIES</Button>
      </Paper>
    </Container>
  );
};
