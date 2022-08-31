import UserIcon from "@heroicons/react/solid/UserIcon";
import ExternalLinkIcon from "@heroicons/react/solid/ExternalLinkIcon";

import React from "react";

import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import SvgIcon from "@material-ui/core/SvgIcon";

import { useStyles } from "./nft-detail.style";
import { Typography, Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { getOwner, nftGetSeriesSingle } from "@realitychain/api";

export const NFTDetail = () => {
  const style = useStyles();
  const { id } = useParams();
  const tokenId = id;
  const tokenSeriesId = id.substring(0, id.indexOf(":"));

  const [detail, setDetail] = React.useState(null);
  const [extra, setExtra] = React.useState({});
  const [owner, setOwner] = React.useState("");

  React.useEffect(() => {
    // fetch data nft from id or any else
    getNftDetail(tokenId);
    getNftOwner(tokenId);
  }, []);

  React.useEffect(() => {
    if (detail !== null) setExtra(JSON.parse(detail?.metadata?.extra));
  }, [detail]);

  const handleOpenLink = () => {
    // make sure fix link
    window.open(process.env.REACT_APP_NFT_PARAS_URL + id + "/" + tokenId, {
      target: "_blank",
    });
  };

  const getNftDetail = async (tokenId) => {
    try {
      const response = await nftGetSeriesSingle(window.parasContract, tokenId);
      console.log(response);
      setDetail(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getNftOwner = async (tokenId) => {
    try {
      const response = await getOwner(window.parasContract, tokenId);
      console.log(response);
      setOwner(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container style={{ marginTop: 24, maxWidth: 1120, padding: 0 }}>
      <div className={style.content}>
        <Paper className={style.image}>
          <CardMedia
            className={style.media}
            image={detail?.metadata?.media}
            title={"user.nam"}
          />
        </Paper>
        <div className={style.row2}>
          <Typography variant="h1" style={{ marginBottom: 24 }}>
            {detail?.metadata?.title}
          </Typography>
          <Typography variant="body2" style={{ marginBottom: 8 }}>
            Owned by
          </Typography>
          <div className={style.subtitle}>
            <Avatar className={style.avatar} src="" variant="circle">
              <SvgIcon component={UserIcon} viewBox="0 0 20 20" />
            </Avatar>
            <Typography variant="subtitle1">{owner}</Typography>
          </div>
          <Paper className={style.detail} style={{ marginBottom: 24 }}>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Description
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.metadata?.description}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              TYPE
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {extra?.type?.name}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Number of Copies
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.metadata?.copies}
            </Typography>
            {extra?.body && (
              <>
                <Typography
                  variant="subtitle1"
                  className={style.key}
                  color={"textSecondary"}
                >
                  Body
                </Typography>
                <Typography variant="subtitle1" className={style.value}>
                  {extra?.body}
                </Typography>
              </>
            )}

            {extra?.type?.category === "furniture" && (
              <>
                <Typography
                  variant="subtitle1"
                  className={style.key}
                  color={"textSecondary"}
                >
                  Interaction
                </Typography>
                <Typography variant="subtitle1" className={style.value}>
                  {extra?.interaction?.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className={style.key}
                  color={"textSecondary"}
                >
                  Offset
                </Typography>
                <Typography variant="subtitle1" className={style.value}>
                  <div>X {extra?.offsetX}</div>
                  <div>Y {extra?.offsetY}</div>
                </Typography>
              </>
            )}

            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Creator
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.creator_id}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Metaverse
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              Myriad.Town
            </Typography>
          </Paper>
          <Paper className={style.link}>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Utility NFT link
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography
                variant="subtitle1"
                component="a"
                style={{ color: "#D391D6" }}
                onClick={handleOpenLink}
              >
                {`${process.env.REACT_APP_NFT_PARAS_URL}${tokenSeriesId}/${tokenId}`}
              </Typography>
              <SvgIcon component={ExternalLinkIcon} viewBox="0 0 20 20" />
            </div>
          </Paper>
        </div>
      </div>
    </Container>
  );
};
