import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";

import React, { useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { uploadFile, getFileUrl } from '../../lib/services/pinata-proxy'
import { useStyles } from "./create.style";
import {
  nftCreateUtilitySeries, nftMint,
} from "@realitychain/api";

export const CreateNFTComponent = () => {
  const [searchParams] = useSearchParams();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [body, setBody] = React.useState('');
  const [selectedInteraction, setSelectedInteraction] = React.useState('');

  const [open, setOpen] = React.useState(false);
  const [openInteraction, setOpenInteraction] = React.useState(false);
  const [metaverseId, setMetaverseId] = React.useState(
    searchParams.get("metaverseId")
  );

  // make sure data of type
  const types = [
    { id: "avatarhead", name: "AvatarHead", category: 'body' },
    { id: "avatarhair", name: "AvatarHair", category: 'body' },
    { id: "avatarface", name: "AvatarFace", category: 'body' },
    { id: "avatararm", name: "AvatarArm", category: 'body' },
    { id: "avatarhip", name: "AvatarHip", category: 'body' },
    { id: "avatarskirt", name: "AvatarSkirt", category: 'wear' },
    { id: "avatartop", name: "AvatarTop", category: 'wear' },
    { id: "avatarhand", name: "AvatarHand", category: 'body' },
    { id: "avatarthigh", name: "AvatarThigh", category: 'body' },
    { id: "avatarleg", name: "AvatarLeg", category: 'body' },
    { id: "avatarshoe", name: "AvatarShoe", category: 'wear' },
    { id: "floor", name: "Floor", category: 'static' },
    { id: "furniture", name: "Furniture", category: 'furniture' },
    { id: "painting", name: "Painting", category: 'static' },
    { id: "wall", name: "Wall", category: 'static' },
  ];

  const interactions = [
    { id: "none", name: "None" },
    { id: "bed", name: "Bed" },
    { id: "chair", name: "Chair" },
  ]

  React.useEffect(() => {
    console.log(metaverseId);
  }, [metaverseId]);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickInteraction = () => {
    setOpenInteraction(!open);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSelectType = (_type) => {
    setSelectedType(types.filter((item) => item.id === _type)[0]);
    setOpen((open) => !open);
  };

  const handleSelectInteraction = (_interaction) => {
    setSelectedInteraction(interactions.filter((interactions) => interactions.id === _interaction)[0]);
    setOpenInteraction((open) => !open);
  };

  const handleChange = (event) => {
    setBody(event.target.value);
  };

  const uploadFieldRef = useRef(null);

  const selectFile = () => {
    const uploadField = uploadFieldRef?.current;

    if (!uploadField) return;

    uploadField.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);

      if (uploadFieldRef && uploadFieldRef.current) {
        uploadFieldRef.current.value = "";
      }
    }
  };

  const handlePreview = () => {
    window.open("https://near.realitychain.io/previewer", { target: "_blank" });
  };

  const handleMint = async () => {
    if (name && image && description && selectedType) {
      const blob = new Blob([image], { type: image.type })

      const result = await uploadFile({
        title: image.name,
        type: image.type,
        size: image.size,
        file: blob
      })

      const link = getFileUrl(result.IpfsHash)

      const type = {
        type: selectedType
      }

      if (selectedType === 'wear') {
        type['body'] = body
      }
      if (selectedType === 'furniture') {
        type['interaction'] = selectedInteraction
      }

      const utilityResult = await nftCreateUtilitySeries(window.parasContract, {
        token_metadata: {
          title: name,
          media: link,
          reference: link,
          copies: 100,
          issued_at: "",
          description: description,
          media_hash: null,
          expires_at: null,
          starts_at: null,
          updated_at: null,
          extra: JSON.stringify(type),
          reference_hash: null,
        },
        price: null,
        royalty: {
          [window.accountId]: 1000,
        },
      });

      await nftMint(window.parasContract, {
        token_series_id: utilityResult.token_series_id,
        receiver_id: window.accountId,
      });
    }
  };

  const style = useStyles();
  return (
    <Container style={{ marginTop: 24, maxWidth: 888, padding: 0 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {/* TODO: Breadcrumbs */}
        <Typography variant="h6">NFT Utility</Typography>
        <SvgIcon component={ChevronRightIcon} viewBox="0 0 20 20" />
        <Typography variant="h6">Create NFT Utility</Typography>
      </div>
      <Paper style={{ minHeight: 972, padding: 24, marginBottom: 24 }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Create NFT Utility
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: 24 }}
          color="textSecondary"
        >
          Create and use your own NFT Utility in metaverse.
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* need ID, anything else to get myriad.town data */}
          <CardMedia className={style.picture} image={""} title={"image"} />
          <Typography variant="h6">Myriad.town</Typography>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          <Paper className={style.blackPaper}>
            {!image && (
              <Typography variant="subtitle1">No image preview</Typography>
            )}
            {!!image && (
              <CardMedia
                className={style.media}
                image={
                  image
                    ? image instanceof File
                      ? URL.createObjectURL(image)
                      : image
                    : ""
                }
                title={"image"}
              />
            )}
          </Paper>

          <div style={{ width: "100%" }}>
            <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
              NAME
            </Typography>
            <TextField
              value={name}
              onChange={handleChangeName}
              style={{ marginBottom: 24 }}
              className={style.input}
              id="outlined-basic"
              fullWidth
              placeholder="Round head"
            />

            <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
              DESCRIPTION
            </Typography>
            <TextField
              value={description}
              onChange={handleChangeDescription}
              style={{ marginBottom: 24 }}
              className={style.input}
              id="outlined-basic"
              fullWidth
              placeholder="Just to make variation"
              multiline
              minRows={3}
            />

            <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
              TYPE
            </Typography>
            <List
              aria-labelledby="nested-list-subheader"
              className={style.list}
              style={{ marginBottom: 24 }}
              dense
            >
              <ListItem button onClick={handleClick}>
                <ListItemText
                  primary={selectedType ? selectedType.name : "Select category"}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                {types.map((type) => (
                  <List component="div" disablePadding dense>
                    <ListItem
                      button
                      className={style.nested}
                      key={type.id}
                      onClick={() => handleSelectType(type.id)}
                    >
                      <ListItemText primary={type.name} />
                    </ListItem>
                  </List>
                ))}
              </Collapse>
            </List>
            
            {selectedType.category === 'wear' && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
                  BODY
                </Typography>
                <RadioGroup aria-label="body" name="gender1" value={body} onChange={handleChange} style={{display: 'flex', gap: 16, flexDirection: 'row', marginBottom: 24}}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </>
            )}

            {selectedType.category === 'furniture' && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
                  INTERACTION
                </Typography>
                <List
                  aria-labelledby="nested-list-subheader"
                  className={style.list}
                  style={{ marginBottom: 24 }}
                  dense
                >
                  <ListItem button onClick={handleClickInteraction}>
                    <ListItemText
                      primary={selectedInteraction ? selectedInteraction.name : "Select category"}
                    />
                    {openInteraction ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openInteraction} timeout="auto" unmountOnExit>
                    {interactions.map((interaction) => (
                      <List component="div" disablePadding dense>
                        <ListItem
                          button
                          className={style.nested}
                          key={interaction.id}
                          onClick={() => handleSelectInteraction(interaction.id)}
                        >
                          <ListItemText primary={interaction.name} />
                        </ListItem>
                      </List>
                    ))}
                  </Collapse>
                </List>
              </>
            )}

            <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
              File
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 8,
              }}
            >
              <input
                type="file"
                ref={uploadFieldRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/png"
              />
              <Button
                variant="contained"
                color="secondary"
                className={style.button}
                onClick={selectFile}
              >
                browse
              </Button>
              <Typography
                variant="body2"
                style={{ wordWrap: "break-word", width: 350 }}
              >
                {image ? image.name : "No file selected"}
              </Typography>
            </div>
            <Typography variant="caption" color="textSecondary">
              Upload your file here in PNG format.
            </Typography>

            <div style={{ textAlign: "right", marginTop: 24 }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ width: "auto", marginRight: 16 }}
                onClick={handlePreview}
              >
                preview
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "auto" }}
                onClick={handleMint}
              >
                mint
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </Container>
  );
};
