import React from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

export const Marketplace = () => {
  return (
    <Container
      style={{
        marginTop: 153.5,
        maxWidth: 1115,
        padding: 0,
        paddingTop: 64.5,
        paddingBottom: 64.5,
      }}
    >
      <div style={{ position: "relative", textAlign: "center" }}>
        <Typography
          variant="h1"
          style={{
            fontSize: 48,
            wordWrap: "break-word",
            marginBottom: 28,
          }}
        >
          COMING SOON
        </Typography>
      </div>
    </Container>
  );
};
