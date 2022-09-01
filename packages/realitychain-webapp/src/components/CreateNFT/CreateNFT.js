import ChevronRightIcon from "@heroicons/react/solid/ChevronRightIcon";

import React, { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Cookies from "js-cookie";

import { uploadFile, getFileUrl } from "../../lib/services/pinata-proxy";
import { useStyles } from "./create.style";
import { nftCreateUtilitySeries } from "@realitychain/api";

export const CreateNFTComponent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const createNft = Cookies.get("create_nft");

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [body, setBody] = React.useState("");
  const [selectedInteraction, setSelectedInteraction] = React.useState("");
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [copies, setCopies] = React.useState(1);
  const [isDisableButtonMint, setIsDisableButtonMint] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [openInteraction, setOpenInteraction] = React.useState(false);
  const [metaverseId, setMetaverseId] = React.useState(
    searchParams.get("metaverseId")
  );

  // make sure data of type
  const types = [
    { id: "avatarhead", name: "AvatarHead", category: "body" },
    { id: "avatarhair", name: "AvatarHair", category: "body" },
    { id: "avatarface", name: "AvatarFace", category: "body" },
    { id: "avatararm", name: "AvatarArm", category: "body" },
    { id: "avatarhip", name: "AvatarHip", category: "body" },
    { id: "avatarskirt", name: "AvatarSkirt", category: "wear" },
    { id: "avatartop", name: "AvatarTop", category: "wear" },
    { id: "avatarhand", name: "AvatarHand", category: "body" },
    { id: "avatarthigh", name: "AvatarThigh", category: "body" },
    { id: "avatarleg", name: "AvatarLeg", category: "body" },
    { id: "avatarshoe", name: "AvatarShoe", category: "wear" },
    { id: "floor", name: "Floor", category: "static" },
    { id: "furniture", name: "Furniture", category: "furniture" },
    { id: "painting", name: "Painting", category: "static" },
    { id: "wall", name: "Wall", category: "static" },
  ];

  const interactions = [
    { id: "none", name: "None" },
    { id: "bed", name: "Bed" },
    { id: "chair", name: "Chair" },
  ];

  const showBody = [
    "avatarskirt",
    "avatartop",
    "avatarshoe",
    "avatarhip",
    "avatarhand",
    "avatararm",
    "avatarthigh",
    "avatarleg",
  ];

  React.useEffect(() => {
    if (createNft) {
      Cookies.remove("create_nft");
      navigate("/profile");
    }
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickInteraction = () => {
    setOpenInteraction(!open);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeOffsetX = (e) => {
    setOffsetX(e.target.value);
  };

  const handleChangeOffsetY = (e) => {
    setOffsetY(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeCopies = (e) => {
    if (e.target.value < 1) setCopies(1);
    else setCopies(Number(e.target.value));
  };

  const handleSelectType = (_type) => {
    setSelectedType(types.filter((item) => item.id === _type)[0]);
    setOpen((open) => !open);
  };

  const handleSelectInteraction = (_interaction) => {
    setSelectedInteraction(
      interactions.filter((interactions) => interactions.id === _interaction)[0]
    );
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

  const handleCreateSeries = async () => {
    setLoading(true);
    if (name && image && description && selectedType) {
      const blob = new Blob([image], { type: image.type });

      const result = await uploadFile({
        title: image.name,
        type: image.type,
        size: image.size,
        file: blob,
      });

      const link = getFileUrl(result.IpfsHash);

      const extra = {
        attributes: [],
      };
      // extra.attributes.push({
      //   trait_type: "name",
      //   value: selectedType.name,
      // });
      extra.attributes.push({
        trait_type: "category",
        value: selectedType.category,
      });

      if (showBody.includes(selectedType.id)) {
        extra.attributes.push({
          trait_type: "body",
          value: body,
        });
      }
      if (selectedType.category === "furniture") {
        extra.attributes.push({
          trait_type: "interaction",
          value: selectedInteraction.name,
        });
        extra.attributes.push({
          trait_type: "offsetX",
          value: offsetX,
        });
        extra.attributes.push({
          trait_type: "offsetY",
          value: offsetY,
        });
      }

      Cookies.set("create_nft", "true");

      await nftCreateUtilitySeries(window.parasContract, {
        token_metadata: {
          title: name,
          description: description,
          media: link,
          copies: copies,
          issued_at: "",
          extra: JSON.stringify(extra),
          media_hash: null,
          expires_at: null,
          starts_at: null,
          updated_at: null,
          reference: null,
          reference_hash: null,
        },
        price: null,
        royalty: {
          [window.accountId]: 1000,
        },
      });
    }
  };

  React.useEffect(() => {
    if (loading) setIsDisableButtonMint(true);
    else {
      if (
        name !== "" &&
        description !== "" &&
        image !== "" &&
        selectedType !== ""
      ) {
        if (showBody.includes(selectedType.id)) {
          if (body !== "") setIsDisableButtonMint(false);
          else setIsDisableButtonMint(true);
        } else if (selectedType.category === "furniture") {
          if (selectedInteraction !== "" && offsetX !== 0 && offsetY !== 0)
            setIsDisableButtonMint(false);
          else setIsDisableButtonMint(true);
        } else setIsDisableButtonMint(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    description,
    image,
    selectedType,
    body,
    selectedInteraction,
    offsetX,
    offsetY,
    loading,
  ]);

  const style = useStyles();
  return (
    <Container style={{ marginTop: 24, maxWidth: 888, padding: 0 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {/* TODO: Breadcrumbs */}
        <Typography variant="h6">Utility NFT</Typography>
        <SvgIcon component={ChevronRightIcon} viewBox="0 0 20 20" />
        <Typography variant="h6">Create Utility NFT</Typography>
      </div>
      <Paper style={{ minHeight: 972, padding: 24, marginBottom: 24 }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          Create Utility NFT
        </Typography>
        <Typography
          variant="body1"
          style={{ marginBottom: 24 }}
          color="textSecondary"
        >
          Create and use your own Utility NFT in metaverse.
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
              NUMBER OF COPIES
            </Typography>
            <TextField
              value={copies}
              onChange={handleChangeCopies}
              style={{ marginBottom: 24, width: 100 }}
              className={style.input}
              id="outlined-basic"
              type={"number"}
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

            {showBody.includes(selectedType.id) && (
              <>
                <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
                  BODY
                </Typography>
                <RadioGroup
                  aria-label="body"
                  name="gender1"
                  value={body}
                  onChange={handleChange}
                  style={{
                    display: "flex",
                    gap: 16,
                    flexDirection: "row",
                    marginBottom: 24,
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </>
            )}

            {selectedType.category === "furniture" && (
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
                      primary={
                        selectedInteraction
                          ? selectedInteraction.name
                          : "Select category"
                      }
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
                          onClick={() =>
                            handleSelectInteraction(interaction.id)
                          }
                        >
                          <ListItemText primary={interaction.name} />
                        </ListItem>
                      </List>
                    ))}
                  </Collapse>
                </List>

                <Typography variant="subtitle1" style={{ marginBottom: 4 }}>
                  OFFSET
                </Typography>
                <div className="d-flex" style={{ marginBottom: 24 }}>
                  <div className="d-flex align-items-center  w-25">
                    <div className="me-2">X</div>
                    <TextField
                      value={offsetX}
                      onChange={handleChangeOffsetX}
                      className={`${style.input} me-5`}
                      id="outlined-basic"
                      type="number"
                    />
                  </div>
                  <div className="d-flex align-items-center w-25">
                    <div className="me-2">Y</div>
                    <TextField
                      value={offsetY}
                      onChange={handleChangeOffsetY}
                      className={`${style.input} me-5`}
                      id="outlined-basic"
                      type="number"
                    />
                  </div>
                </div>
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
                style={{
                  width: "auto",
                  marginRight: 16,
                  color: isDisableButtonMint && "#757575",
                  borderColor: isDisableButtonMint && "#757575",
                }}
                onClick={handlePreview}
                disabled={isDisableButtonMint}
              >
                preview
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "auto",
                  color: isDisableButtonMint && "#757575",
                  backgroundColor:
                    isDisableButtonMint && "rgba(255, 255, 255, 0.1)",
                }}
                onClick={handleCreateSeries}
                disabled={isDisableButtonMint}
              >
                {loading ? "creating" : "create"}
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </Container>
  );
};
