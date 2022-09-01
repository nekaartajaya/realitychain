import UserIcon from "@heroicons/react/solid/UserIcon";
import ExternalLinkIcon from "@heroicons/react/solid/ExternalLinkIcon";

import React from "react";

import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import SvgIcon from "@material-ui/core/SvgIcon";

import { useStyles } from "./parcel-detail.style";
import { Typography, Avatar } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { getOwner, nftGetSeriesSingle } from "@realitychain/api";

export const ParcelDetail = () => {
  const style = useStyles();
  const { id } = useParams();
  const tokenId = id;
  const tokenSeriesId = id.substring(0, id.indexOf(":"));

  const [detail, setDetail] = React.useState(null);
  const [extra, setExtra] = React.useState({});
  const [owner, setOwner] = React.useState("");

  React.useEffect(() => {
    // fetch data nft from id or any else
    getNftDetail(tokenSeriesId);
    getNftOwner(tokenId);
  }, []);

  React.useEffect(() => {
    if (detail !== null) setExtra(JSON.parse(detail?.metadata?.extra));
  }, [detail]);

  const handleOpenLink = () => {
    // make sure fix link
    window.open(
      process.env.REACT_APP_NFT_PARAS_URL + `${tokenSeriesId}/ tokenId`,
      {
        target: "_blank",
      }
    );
  };

  const getNftDetail = async (tokenSeriesId) => {
    try {
      const response = await nftGetSeriesSingle(
        window.parcelsContract,
        tokenSeriesId
      );
      console.log(response);
      setDetail(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getNftOwner = async (tokenId) => {
    try {
      const response = await getOwner(window.parcelsContract, tokenId);
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
              World
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.world_id}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Land
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.land_id}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Type
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.land_type}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              X
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.pos_x}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              Y
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.pos_y}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              SIZE
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.parcel_metadata?.size} m<sup>2</sup>
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              REAL Needed
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              628,571.43
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              REAL/NTF Parcel
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              571.4285714
            </Typography>
          </Paper>
          <Paper className={style.detail} style={{ marginBottom: 24 }}>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              CREATOR
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              {detail?.creator_id}
            </Typography>
            <Typography
              variant="subtitle1"
              className={style.key}
              color={"textSecondary"}
            >
              METAVERSE
            </Typography>
            <Typography variant="subtitle1" className={style.value}>
              Myriad.Town
            </Typography>
          </Paper>
        </div>
      </div>
    </Container>
  );
};
