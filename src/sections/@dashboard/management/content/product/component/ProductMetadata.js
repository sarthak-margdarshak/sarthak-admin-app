import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import { Item } from "components/item/Item";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import { timeAgo } from "auth/AppwriteContext";
import { Fragment } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";

export default function ProductMetadata({ product }) {
  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label="Metadata"
          color="error"
          icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Index →</Typography>
                <IndexView id={product?.bookIndex?.$id} />
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">System Generated Id →</Typography>
                <Typography variant="body2">{product?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">MRP →</Typography>
                <Typography variant="body2">{`₹ ${product?.mrp}`}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Selling Price →</Typography>
                <Typography variant="body2">
                  {`₹ ${product?.sellPrice}`}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Sarthak Id →</Typography>
                <Typography variant="body2">{product?.productId}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Status →</Typography>
                <Typography variant="body2">
                  {product?.published ? "Published" : "Draft"}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created By →</Typography>
                <Typography variant="body2">{product?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Created At →</Typography>
                <Tooltip title={product?.$createdAt}>
                  <Typography variant="body2">
                    {timeAgo.format(
                      Date.parse(
                        product?.$createdAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Updated By →</Typography>
                <Typography variant="body2">{product?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography variant="body1">Updated At →</Typography>
                <Tooltip title={product?.$updatedAt}>
                  <Typography variant="body2">
                    {timeAgo.format(
                      Date.parse(
                        product?.$updatedAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          {product?.published && (
            <Fragment>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved By →</Typography>
                    <Typography variant="body2">{product?.approver}</Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body1">Approved At →</Typography>
                    <Tooltip title={product?.approvedAt}>
                      <Typography variant="body2">
                        {timeAgo.format(
                          Date.parse(
                            product?.approvedAt ||
                              "2000-01-01T00:00:00.000+00:00"
                          )
                        )}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Item>
              </Grid>
            </Fragment>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
