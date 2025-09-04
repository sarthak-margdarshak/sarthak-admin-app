import { Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import Iconify from "components/iconify";
import { timeAgo } from "auth/AppwriteContext";
import { Fragment } from "react";
import { Item } from "components/item/Item";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "components/accordion";
import { lang } from "assets/data";
import IndexView from "sections/@dashboard/management/content/common/IndexView";

export default function QuestionMetadata({ question }) {
  return (
    <Accordion>
      <AccordionSummary>
        <Chip
          label="Metadata"
          color="info"
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
                <IndexView id={question.bookIndexId} />
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🪪 System Generated Id ➜
                </Typography>
                <Typography>{question?.$id}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🏷️ Sarthak Id ➜
                </Typography>
                <Typography>{question?.qnId}</Typography>
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
                  {question?.published ? "Published ✅" : "Draft❌"}
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
                <Typography>{lang[question?.lang]?.level}</Typography>
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
                  {question?.translatedLang
                    .map((x, i) => lang[x]?.level)
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
                <Typography>{question?.creator}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  🕒 Created At ➜
                </Typography>
                <Tooltip title={question?.$createdAt}>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        question?.$createdAt || "2000-01-01T00:00:00.000+00:00"
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
                <Typography>{question?.updater}</Typography>
              </Stack>
            </Item>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Item>
              <Stack direction="row" spacing={2}>
                <Typography fontWeight="bold" variant="h6">
                  ⌛ Updated At ➜
                </Typography>
                <Tooltip title={question?.$updatedAt}>
                  <Typography
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {timeAgo.format(
                      Date.parse(
                        question?.$updatedAt || "2000-01-01T00:00:00.000+00:00"
                      )
                    )}
                  </Typography>
                </Tooltip>
              </Stack>
            </Item>
          </Grid>

          {question?.published && (
            <Fragment>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography fontWeight="bold" variant="h6">
                      👨🏻‍💻 Approved By ➜
                    </Typography>
                    <Typography>{question?.approver}</Typography>
                  </Stack>
                </Item>
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Item>
                  <Stack direction="row" spacing={2}>
                    <Typography fontWeight="bold" variant="h6">
                      ⏲ Approved At ➜
                    </Typography>
                    <Tooltip title={question?.approvedAt}>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        {timeAgo.format(
                          Date.parse(
                            question?.approvedAt ||
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
