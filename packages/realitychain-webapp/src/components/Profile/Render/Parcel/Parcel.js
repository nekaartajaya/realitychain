import {
  getOwner,
  getOwnerById,
  nftGetSeriesByCreatorId,
  nftMint,
  nftTokensForOwner,
} from "@realitychain/api";

import React from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Divider from "@material-ui/core/Divider";

import { useNavigate } from "react-router-dom";

import { useStyles } from "./parcel.style";
import Cookies from "js-cookie";
export const NftParcel = ({ nfts }) => {
  const style = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getNftParcels();
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [data]);

  const getNftParcels = async () => {
    try {
      const response = await nftTokensForOwner(
        window.parcelsContract,
        window.accountId
      );
      setData(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDetail = (id) => {
    navigate(`/parcel/${id}`);
  };

  if (!loading && !data.length)
    return (
      <Paper
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: 480,
        }}
      >
        <Typography variant="h4" style={{ marginBottom: 10 }}>
          You don’t have an NFT parcel
        </Typography>
        <Typography variant="subtitle1" style={{ marginBottom: 40 }}>
          The NFT Parcel will be shown on this page once you have minted.
        </Typography>
      </Paper>
    );

  const loadingItem = [];
  for (let i = 0; i < 4; i++) {
    loadingItem.push(
      <Paper variant="outlined" style={{ width: 256, background: "#222731" }}>
        <div>
          <div className="skeleton skeleton-image"></div>
          <div className="skeleton skeleton-text" style={{ height: 20 }}></div>
          <div
            className="skeleton skeleton-text"
            style={{ height: 10, width: 100 }}
          ></div>
          <div
            className="skeleton skeleton-text"
            style={{ height: 10, width: 150 }}
          ></div>
          <div
            className="skeleton skeleton-text"
            style={{ height: 10, width: 120 }}
          ></div>
          <div className="skeleton skeleton-text" style={{ height: 20 }}></div>
        </div>
      </Paper>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 32,
        marginBottom: 24,
        paddingBottom: 24,
      }}
    >
      {/* maping */}
      {loading
        ? loadingItem
        : data.map((v, i) => {
            return (
              <Paper
                style={{ width: 256, cursor: "pointer" }}
                onClick={() => handleOpenDetail(v.token_id)}
              >
                <div>
                  <Paper
                    variant="outlined"
                    style={{
                      width: "100%",
                      height: 256,
                      background: "#222731",
                    }}
                  >
                    <CardMedia
                      className={style.media}
                      image={v.metadata.media}
                      title={"user.nam"}
                    />
                  </Paper>
                  <div className={style.content}>
                    <Typography variant="h6" style={{ marginBottom: 4 }}>
                      {v?.metadata.title}
                    </Typography>
                    <Typography variant="caption" style={{ color: "#D391D6" }}>
                      Myriad.Town
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    padding: "0 16px 16px",
                  }}
                ></div>
              </Paper>
            );
          })}
      {/*  */}
    </div>
  );
};
