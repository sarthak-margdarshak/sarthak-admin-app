import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import { Item } from "components/item/Item";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import { timeAgo } from "auth/AppwriteContext";
import { Fragment } from "react";
import { lang } from "assets/data";
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
          color="success"
          icon={<Iconify icon="fluent-color:calendar-data-bar-16" />}
        />
      </AccordionSummary>

      <AccordionDetails>
        <Grid container sx={{ mt: 2 }} spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  👉 Index ➜
                </Typography>
                <IndexView
                  id={product?.bookIndexId || product?.bookIndex?.$id}
                />
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🪪 System Generated Id ➜
                </Typography>
                <Typography>{product?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  💸 MRP ➜
                </Typography>
                <Typography>{`₹ ${product?.mrp}`}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🛒 Selling Price ➜
                </Typography>
                <Typography>{`₹ ${product?.sellPrice}`}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🏷️ Sarthak Id ➜
                </Typography>
                <Typography>{product?.productId}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  📊 Status ➜
                </Typography>
                <Typography>
                  {product?.published ? "Published ✅" : "Draft❌"}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  📌 Primary Language ➜
                </Typography>
                <Typography>{lang[product?.lang]?.level}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🌎 Translated Language ➜
                </Typography>
                <Typography>
                  {(product?.translatedLang || [])
                    .map((x) => lang[x]?.level)
                    .join(", ")}
                </Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  ✍ Created By ➜
                </Typography>
                <Typography>{product?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🕒 Created At ➜
                </Typography>
                <Tooltip title={product?.$createdAt}>
                  <Typography
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
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
                <Typography fontWeight="bold" variant="h6">
                  🧙🏼 Updated By ➜
                </Typography>
                <Typography>{product?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  ⌛ Updated At ➜
                </Typography>
                <Tooltip title={product?.$updatedAt}>
                  <Typography
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
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
                    <Typography fontWeight="bold" variant="h6">
                      👨🏻‍💻 Approved By ➜
                    </Typography>
                    <Typography>{product?.approver}</Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography fontWeight="bold" variant="h6">
                      ⏲ Approved At ➜
                    </Typography>
                    <Tooltip title={product?.approvedAt}>
                      <Typography
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
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
