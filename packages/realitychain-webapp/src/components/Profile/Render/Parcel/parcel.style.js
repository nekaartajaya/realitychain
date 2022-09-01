import { createStyles, makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    media: {
      height: 256,
      width: 256,
      objectFit: "contain",
      backgroundSize: "contain !important",
    },
    content: {
      padding: 16,
      // minHeight: 110,
    },
  })
);
