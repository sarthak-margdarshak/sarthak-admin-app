import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";
import Label from "../../../components/label";
import { PATH_DASHBOARD } from "../../../routes/paths";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";

export default function ProductTableRow({ row }) {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.productId}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.name}
          </Typography>
        </TableCell>

        <TableCell align="left">{row.description}</TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.type}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.mrp}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" paragraph>
            {row.sellPrice}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={(row?.published === false && "error") || "success"}
            sx={{ textTransform: "capitalize" }}
          >
            {row?.published ? "Published" : "Unpublished"}
          </Label>
        </TableCell>

        <TableCell align="center">
          <IconButton
            size="small"
            onClick={() => navigate(PATH_DASHBOARD.product.view(row.$id))}
          >
            <RemoveRedEyeIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
