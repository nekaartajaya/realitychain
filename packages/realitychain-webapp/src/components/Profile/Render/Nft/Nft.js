import { nftGetSeriesByCreatorId, nftMint } from "@realitychain/api";

import React from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Divider from "@material-ui/core/Divider";

import { useNavigate } from "react-router-dom";

import { useStyles } from "./nft.style";
export const NftUtility = ({ nfts }) => {
  const style = useStyles();
  const navigate = useNavigate();

  const handleCreateSeries = async (tokenSeriesId) => {      
    await nftMint(window.parasContract, {
      token_series_id: tokenSeriesId,
      receiver_id: window.accountId,
    });
  };

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getNftUtilityByCreatorId();
  }, []);

  const getNftUtilityByCreatorId = async () => {
    try {
      const response = await nftGetSeriesByCreatorId(
        "https://api-v3-marketplace-testnet.paras.id",
        window.accountId
      );
      setData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDetail = (id) => {
    navigate(`/nft-utility/${id}`);
  };

  if (!nfts.length)
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
          Create NFT utility now!
        </Typography>
        <Typography variant="subtitle1" style={{ marginBottom: 40 }}>
          Create and use your NFT utilities in metaverse.
        </Typography>
        <Button variant="text">LEARN MORE</Button>
      </Paper>
    );

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
      {data.map((v, i) => {
        let toMintOrNotToMint = "";
        if (v.in_circulation > 0) {
          toMintOrNotToMint = (
            <Typography variant="caption" color="textSecondary">
              Minted
            </Typography>
          );
        } else {
          toMintOrNotToMint = (
            <Button variant="contained" color="primary" onClick={() => handleCreateSeries(v.token_series_id)}>
              Mint
            </Button>
          );
        }
        return (
          <Paper
            style={{ width: 256, cursor: "pointer" }}
            onClick={() => handleOpenDetail(v.token_id)}
          >
            <Paper
              variant="outlined"
              style={{ width: "100%", height: 256, background: "#222731" }}
            >
              <CardMedia
                className={style.media}
                image={v.metadata.media}
                title={"user.nam"}
              />
            </Paper>
            <div className={style.content}>
              <Typography variant="h6" style={{ marginBottom: 4 }}>
                {v.metadata.title}
              </Typography>
              <div>
                <Typography variant="caption" color="textSecondary">
                  by {v.owner_id}
                </Typography>
              </div>
              <Typography variant="caption" style={{ color: "#D391D6" }}>
                Myriad.Town
              </Typography>
              <Divider
                style={{
                  background: "#2B3240",
                  height: 2,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {toMintOrNotToMint}
              </div>
            </div>
          </Paper>
        );
      })}
      {/*  */}
    </div>
  );
};
