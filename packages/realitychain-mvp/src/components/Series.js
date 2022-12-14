import React from "react";
import {
  Button,
  Row,
  Col,
  Container,
  Badge,
  InputGroup,
  Form,
} from "react-bootstrap";
import "./World.css";
import { useNavigate } from "react-router-dom";
import {
  nftCreateParcelSeries,
  nftCreateVoucherSeries,
} from "@realitychain/api";

export const SeriesComponent = ({ balance }) => {
  const [value, setValue] = React.useState();
  const navigate = useNavigate();

  const voucherParams = {
    token_metadata: {
      title: "RC Parcels 10",
      media:
        "https://ipfs.debio.network/ipfs/QmcX8GohhCS2Q2kMFLL38aUffN4brCpaz8d6LtiYLqGcFn",
      reference: "bafybeifvzitvju4ftwnkf7w7yakz7i5colcey223uk2ui4t5z3ss7l2od4",
      copies: 1000,
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
      world_id: "w10",
      land_id: "b10",
      size_x: 11,
      size_y: 11,
      pos_x: -120,
      pos_y: -120,
      land_type: "Building",
    },
    ...voucherParams,
  };

  const handleCreateSeries = async () => {
    await nftCreateParcelSeries(window.parcelsContract, parcelParams);
    navigate("/staking");
  };

  const price = () => {
    return "0";
  };

  return (
    <div
      style={{
        height: "calc(100vh - 66px)",
        padding: 50,
      }}
    >
      <h1>CREATE SERIES</h1>
      <Container style={{ marginTop: 50 }}>
        <Row>
          <Col>
            <div className="col1">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 24,
                  }}
                >
                  <Button
                    variant={value !== price() ? "outline-dark" : "primary"}
                    style={{ width: "100%" }}
                    onClick={handleCreateSeries}
                  >
                    CREATE SERIES
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
