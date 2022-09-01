import { nftGetSeriesByCreatorId, nftMint } from "@realitychain/api";

import React from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Divider from "@material-ui/core/Divider";

import { useNavigate } from "react-router-dom";

import { useStyles } from "./nft.style";
import Cookies from "js-cookie";
export const NftUtility = ({ nfts }) => {
  const style = useStyles();
  const navigate = useNavigate();
  const mintNft = Cookies.get("mint_nft");
  const [loading, setLoading] = React.useState(true);

  const handleMint = async (tokenSeriesId) => {
    Cookies.set("mint_nft", "true");
    await nftMint(window.parasContract, {
      token_series_id: tokenSeriesId,
      receiver_id: window.accountId,
    });
  };

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getNftUtilityByCreatorId();
    if (mintNft) {
      getNftUtilityByCreatorId();
      Cookies.remove("mint_nft");
    }
  }, []);

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, [data]);

  const getNftUtilityByCreatorId = async () => {
    setTimeout(async () => {
      try {
        const response = await nftGetSeriesByCreatorId(
          "https://api-v3-marketplace-testnet.paras.id",
          window.accountId
        );

        setData(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }, 2500);
  };

  const handleOpenDetail = (id) => {
    navigate(`/nft-utility/${id}`);
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
          Create NFT utility now!
        </Typography>
        <Typography variant="subtitle1" style={{ marginBottom: 40 }}>
          Create and use your NFT utilities in metaverse.
        </Typography>
        <Button variant="text">LEARN MORE</Button>
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
            let mintCard = [];
            if (!v.total_mint || v.total_mint < v.metadata.copies) {
              mintCard.push(
                <Paper style={{ width: 256, cursor: "pointer" }}>
                  <div onClick={() => handleOpenDetail(v.token_series_id)}>
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
                        {v.metadata.title}
                      </Typography>
                      <div>
                        <Typography variant="caption" color="">
                          Total Mint{"  "}
                          <span style={{ color: "#B341BA" }}>
                            {v.total_mint ?? 0} / {v.metadata.copies}
                          </span>
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" color="textSecondary">
                          by {v.creator_id}
                        </Typography>
                      </div>
                      <Typography
                        variant="caption"
                        style={{ color: "#D391D6" }}
                      >
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
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      padding: "0 16px 16px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleMint(v.token_series_id)}
                    >
                      Mint
                    </Button>
                  </div>
                </Paper>
              );
            }

            return <>{mintCard}</>;
          })}
      {!loading &&
        data.map((v, i) => {
          let listCards = [];
          for (let j = 1; j <= v.total_mint; j++) {
            listCards.push(
              <Paper style={{ width: 256, cursor: "pointer" }}>
                <div
                  onClick={() => handleOpenDetail(`${v.token_series_id}:${j}`)}
                >
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
                      {v.metadata.title}
                    </Typography>
                    <div>
                      <Typography variant="caption" color="">
                        Edition{" "}
                        <span style={{ color: "#B341BA" }}>
                          {j} of {v.metadata.copies}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" color="textSecondary">
                        by {v.creator_id}
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
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    padding: "8px 16px 16px",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ fontSize: 14 }}
                  >
                    MINTED
                  </Typography>
                </div>
              </Paper>
            );
          }

          return <>{listCards}</>;
        })}
    </div>
  );
};
