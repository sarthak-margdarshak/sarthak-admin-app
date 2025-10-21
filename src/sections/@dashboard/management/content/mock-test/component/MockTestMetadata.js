import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import IndexView from "sections/@dashboard/management/content/common/IndexView";
import { timeAgo } from "auth/AppwriteContext";
import { Fragment } from "react";
import { Item } from "components/item/Item";
import { lang } from "assets/data";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";

export default function MockTestMetadata({ mockTest }) {
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
                  id={mockTest?.bookIndexId || mockTest?.bookIndex?.$id}
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
                <Typography>{mockTest?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🕒 Duration ➜
                </Typography>
                <Typography>{`${mockTest?.duration} minutes`}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🧭 Level ➜
                </Typography>
                <Typography>{mockTest?.level}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🏷️ Sarthak Id ➜
                </Typography>
                <Typography>{mockTest?.mtId}</Typography>
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
                  {mockTest?.published ? "Published ✅" : "Draft❌"}
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
                <Typography>{lang[mockTest?.lang]?.level}</Typography>
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
                  {(mockTest?.translatedLang || [])
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
                <Typography>{mockTest?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🕒 Created At ➜
                </Typography>
                <Tooltip title={mockTest?.$createdAt}>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        mockTest?.$createdAt || "2000-01-01T00:00:00.000+00:00"
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
                <Typography>{mockTest?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  ⌛ Updated At ➜
                </Typography>
                <Tooltip title={mockTest?.$updatedAt}>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        mockTest?.$updatedAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          {mockTest?.published && (
            <Fragment>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography fontWeight="bold" variant="h6">
                      👨🏻‍💻 Approved By ➜
                    </Typography>
                    <Typography>{mockTest?.approver}</Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography fontWeight="bold" variant="h6">
                      ⏲ Approved At ➜
                    </Typography>
                    <Tooltip title={mockTest?.approvedAt}>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {timeAgo.format(
                          Date.parse(
                            mockTest?.approvedAt ||
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
